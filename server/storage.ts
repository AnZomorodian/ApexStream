import { type Stream, type InsertStream } from "@shared/schema";
import fs from "fs/promises";
import path from "path";

const DB_FILE = path.join(process.cwd(), "database.json");

export interface IStorage {
  getStreams(): Promise<Stream[]>;
  getStream(id: number): Promise<Stream | undefined>;
  createStream(stream: InsertStream): Promise<Stream>;
  updateStream(id: number, stream: Partial<InsertStream>): Promise<Stream | undefined>;
  deleteStream(id: number): Promise<boolean>;
}

export class JsonStorage implements IStorage {
  private async readDb(): Promise<{ streams: Stream[] }> {
    try {
      const data = await fs.readFile(DB_FILE, "utf-8");
      return JSON.parse(data);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        const defaultData = { streams: [] };
        await fs.writeFile(DB_FILE, JSON.stringify(defaultData, null, 2));
        return defaultData;
      }
      throw error;
    }
  }

  private async writeDb(data: { streams: Stream[] }): Promise<void> {
    await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2));
  }

  async getStreams(): Promise<Stream[]> {
    const db = await this.readDb();
    return db.streams;
  }

  async getStream(id: number): Promise<Stream | undefined> {
    const db = await this.readDb();
    return db.streams.find((s) => s.id === id);
  }

  async createStream(insertStream: InsertStream): Promise<Stream> {
    const db = await this.readDb();
    const id = db.streams.length > 0 ? Math.max(...db.streams.map((s) => s.id)) + 1 : 1;
    const stream: Stream = { ...insertStream, id };
    db.streams.push(stream);
    await this.writeDb(db);
    return stream;
  }

  async updateStream(id: number, updateData: Partial<InsertStream>): Promise<Stream | undefined> {
    const db = await this.readDb();
    const index = db.streams.findIndex((s) => s.id === id);
    if (index === -1) return undefined;
    
    const stream = { ...db.streams[index], ...updateData };
    db.streams[index] = stream;
    await this.writeDb(db);
    return stream;
  }

  async deleteStream(id: number): Promise<boolean> {
    const db = await this.readDb();
    const index = db.streams.findIndex((s) => s.id === id);
    if (index === -1) return false;
    
    db.streams.splice(index, 1);
    await this.writeDb(db);
    return true;
  }
}

export const storage = new JsonStorage();
