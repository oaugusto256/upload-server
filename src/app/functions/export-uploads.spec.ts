import { makeUpload } from "@/test/factories/make-upload";
import { randomUUID } from "node:crypto";
import { describe, it } from "vitest";
import { exportUploads } from "./export-uploads";

describe("Export uploads", () => {
  it("should be able to export uploads", async () => {
    const namePattern = `${randomUUID()}.jpg`;

    const upload1 = await makeUpload({ name: namePattern });
    const upload2 = await makeUpload({ name: namePattern });
    const upload3 = await makeUpload({ name: namePattern });
    const upload4 = await makeUpload({ name: namePattern });
    const upload5 = await makeUpload({ name: namePattern });

    const sut = await exportUploads({
      searchQuery: namePattern,
    });
  });
});
