import { uploadImage } from "@/app/functions/upload-image";
import { isRight, unwrapEither } from "@/shared/either";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const uploadImageRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    "/uploads",
    {
      schema: {
        summary: "Upload an image",
        consumes: ["multipart/form-data"],
        // body: z.object({
        //   file: z.instanceof(File),
        // }),
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
      const uploadedFile = await request.file({
        limits: {
          fileSize: 1024 * 1024 * 1, // 1MB
        },
      });

      if (!uploadedFile) {
        return reply.status(400).send({ message: "File is required." });
      }

      const result = await uploadImage({
        fileName: uploadedFile.filename,
        contentType: uploadedFile.mimetype,
        contentStream: uploadedFile.file,
      });

      if (isRight(result)) {
        console.log(unwrapEither(result));

        return reply.status(201).send();
      }

      const error = unwrapEither(result);

      switch (error.constructor.name) {
        case "InvalidFileFormat":
          return reply.status(400).send({ message: error.message });
      }
    },
  );
};
