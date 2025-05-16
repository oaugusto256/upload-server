import { db } from "@/infra/db";
import { schemas } from "@/infra/db/schemas";
import { type Either, makeLeft, makeRight } from "@/shared/either";
import { Readable } from "node:stream";
import { z } from "zod";
import { InvalidFileFormat } from "./errors/invalid-file-format";

const uploadImageInput = z.object({
  fileName: z.string(),
  contentType: z.string(),
  contentStream: z.instanceof(Readable),
});

type UploadImageInput = z.infer<typeof uploadImageInput>;

const allowedMimeTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

export async function uploadImage(
  input: UploadImageInput,
): Promise<Either<InvalidFileFormat, { url: string }>> {
  const { fileName, contentType, contentStream } =
    uploadImageInput.parse(input);

  if (!allowedMimeTypes.includes(contentType)) {
    return makeLeft(new InvalidFileFormat());
  }

  // TODO: Upload image to Cloudflare R2

  await db.insert(schemas.uploads).values({
    name: fileName,
    remoteKey: fileName,
    remoteUrl: fileName,
  });

  return makeRight({ url: "" });
}
