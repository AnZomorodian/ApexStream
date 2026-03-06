import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.streams.list.path, async (req, res) => {
    try {
      const streams = await storage.getStreams();
      res.json(streams);
    } catch (e) {
      res.status(500).json({ message: "Failed to load streams" });
    }
  });

  app.get(api.streams.get.path, async (req, res) => {
    try {
      const stream = await storage.getStream(Number(req.params.id));
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
      res.json(stream);
    } catch (e) {
      res.status(500).json({ message: "Failed to load stream" });
    }
  });

  app.post(api.streams.create.path, async (req, res) => {
    try {
      const input = api.streams.create.input.parse(req.body);
      const stream = await storage.createStream(input);
      res.status(201).json(stream);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.put(api.streams.update.path, async (req, res) => {
    try {
      const input = api.streams.update.input.parse(req.body);
      const stream = await storage.updateStream(Number(req.params.id), input);
      if (!stream) {
        return res.status(404).json({ message: "Stream not found" });
      }
      res.json(stream);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete(api.streams.delete.path, async (req, res) => {
    try {
      const success = await storage.deleteStream(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Stream not found" });
      }
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ message: "Failed to delete stream" });
    }
  });

  // Seed data if empty
  try {
    const existing = await storage.getStreams();
    if (existing.length === 0) {
      const initialStreams = [
          { 
              streamId: 'sky-1080', 
              title: "Sky Sports F1 (Ultra)", 
              provider: "StreamFree App", 
              lang: "English", 
              url: "https://streamfree.app/embed/racing/skyf1?server=origin&quality=1080p",
              quality: "1080p"
          },
          { 
              streamId: 'main-1', 
              title: "International Feed", 
              provider: "Primary", 
              lang: "English", 
              url: "https://pushembdz.store/embed/019cbe1e-1afc-75c3-86e0-41c48a9cfb9b",
              quality: "HD"
          },
          { 
              streamId: 'main-2', 
              title: "International Feed (Alt)", 
              provider: "Secondary", 
              lang: "English", 
              url: "https://pushembdz.store/embed/019cbe1d-2730-7464-89c0-73462be43600",
              quality: "HD"
          },
          { 
              streamId: 'es', 
              title: "F1 TV Latino", 
              provider: "ES Server", 
              lang: "Español", 
              url: "https://pushembdz.store/embed/019cbfc5-5b1d-7b79-8204-91580bdca60f",
              quality: "HD"
          },
          { 
              streamId: 'it', 
              title: "Sky Italia", 
              provider: "IT Server", 
              lang: "Italiano", 
              url: "https://pushembdz.store/embed/019cbfc5-5b1d-7482-887b-b83fbc2da8cb",
              quality: "HD"
          }
      ];
      for (const s of initialStreams) {
        await storage.createStream(s);
      }
    }
  } catch (e) {
    console.error("Failed to seed database", e);
  }

  return httpServer;
}
