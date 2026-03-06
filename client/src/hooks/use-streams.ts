import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { z } from "zod";

function parseWithLogging<T>(schema: z.ZodSchema<T>, data: unknown, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.error(`[Zod] ${label} validation failed:`, result.error.format());
    throw new Error(`Validation failed for ${label}`);
  }
  return result.data;
}

export function useStreams() {
  return useQuery({
    queryKey: [api.streams.list.path],
    queryFn: async () => {
      const res = await fetch(api.streams.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch streams");
      const data = await res.json();
      return parseWithLogging(api.streams.list.responses[200], data, "streams.list");
    },
  });
}

export function useStream(id: number) {
  return useQuery({
    queryKey: [api.streams.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.streams.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch stream");
      const data = await res.json();
      return parseWithLogging(api.streams.get.responses[200], data, "streams.get");
    },
    enabled: !!id,
  });
}

type CreateStreamInput = z.infer<typeof api.streams.create.input>;

export function useCreateStream() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateStreamInput) => {
      const validated = api.streams.create.input.parse(data);
      const res = await fetch(api.streams.create.path, {
        method: api.streams.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation error");
        }
        throw new Error("Failed to create stream");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.streams.create.responses[201], responseData, "streams.create");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.streams.list.path] });
    },
  });
}

type UpdateStreamInput = z.infer<typeof api.streams.update.input>;

export function useUpdateStream() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & UpdateStreamInput) => {
      const validated = api.streams.update.input.parse(updates);
      const url = buildUrl(api.streams.update.path, { id });
      
      const res = await fetch(url, {
        method: api.streams.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Validation error");
        }
        if (res.status === 404) throw new Error("Stream not found");
        throw new Error("Failed to update stream");
      }
      
      const responseData = await res.json();
      return parseWithLogging(api.streams.update.responses[200], responseData, "streams.update");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.streams.list.path] });
      queryClient.invalidateQueries({ queryKey: [api.streams.get.path, variables.id] });
    },
  });
}

export function useDeleteStream() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.streams.delete.path, { id });
      const res = await fetch(url, { 
        method: api.streams.delete.method,
        credentials: "include" 
      });
      
      if (res.status === 404) throw new Error("Stream not found");
      if (!res.ok) throw new Error("Failed to delete stream");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.streams.list.path] });
    },
  });
}
