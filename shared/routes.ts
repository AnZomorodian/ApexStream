import { z } from "zod";
import { insertStreamSchema, streams } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  streams: {
    list: {
      method: "GET" as const,
      path: "/api/streams" as const,
      responses: {
        200: z.array(z.custom<typeof streams.$inferSelect>()),
      },
    },
    get: {
      method: "GET" as const,
      path: "/api/streams/:id" as const,
      responses: {
        200: z.custom<typeof streams.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: "POST" as const,
      path: "/api/streams" as const,
      input: insertStreamSchema,
      responses: {
        201: z.custom<typeof streams.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: "PUT" as const,
      path: "/api/streams/:id" as const,
      input: insertStreamSchema.partial(),
      responses: {
        200: z.custom<typeof streams.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/streams/:id" as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
