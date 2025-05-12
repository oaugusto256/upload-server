import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const uploadImageRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/uploads",
    {
      schema: {
        summary: "Upload an image",
        body: z.object({
          name: z.string(),
          password: z.string().optional(),
        }),
        response: {
          200: z.object({
            uploadId: z.string(),
          }),
          409: z
            .object({
              message: z.string(),
            })
            .describe("Upload already exists"),
        },
      },
    },
    async (request, reply) => {
      await db.insert(schemas.uploads).values({
        name: "test.jpg",
        remoteKey: "test.jpg",
        remoteUrl: "https://test.com/test.jpg",
      });

      return reply.status(201).send({
        uploadId: "Test",
      });
    },
  );
};
