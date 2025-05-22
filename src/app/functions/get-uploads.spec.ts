import { isRight, unwrapEither } from "@/shared/either";
import { makeUpload } from "@/test/factories/make-upload";
import dayjs from "dayjs";
import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getUploads } from "./get-uploads";

describe("Get uploads", () => {
  it("should be able to get the uploads", async () => {
    const namePattern = `${randomUUID()}.jpg`;

    const upload1 = await makeUpload({ name: namePattern });
    const upload2 = await makeUpload({ name: namePattern });
    const upload3 = await makeUpload({ name: namePattern });

    const sut = await getUploads({
      searchQuery: namePattern,
    });

    expect(isRight(sut)).toBe(true);

    const result = unwrapEither(sut);

    expect(result.total).toBe(3);
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });

  it("should be able to get paginated uploads", async () => {
    const namePattern = `${randomUUID()}.jpg`;

    const upload1 = await makeUpload({ name: namePattern });
    const upload2 = await makeUpload({ name: namePattern });
    const upload3 = await makeUpload({ name: namePattern });
    const upload4 = await makeUpload({ name: namePattern });
    const upload5 = await makeUpload({ name: namePattern });

    let sut = await getUploads({
      searchQuery: namePattern,
      page: 1,
      pageSize: 3,
    });

    expect(isRight(sut)).toBe(true);

    let result = unwrapEither(sut);

    expect(result.total).toBe(5);
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
    ]);

    sut = await getUploads({
      searchQuery: namePattern,
      page: 2,
      pageSize: 3,
    });

    result = unwrapEither(sut);

    expect(result.total).toBe(5);
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });

  it("should be able to get sorted uploads", async () => {
    const namePattern = `${randomUUID()}.jpg`;

    const upload1 = await makeUpload({
      createdAt: new Date(),
      name: namePattern,
    });
    const upload2 = await makeUpload({
      createdAt: dayjs().subtract(1, "days").toDate(),
      name: namePattern,
    });
    const upload3 = await makeUpload({
      createdAt: dayjs().subtract(2, "days").toDate(),
      name: namePattern,
    });
    const upload4 = await makeUpload({
      createdAt: dayjs().subtract(3, "days").toDate(),
      name: namePattern,
    });
    const upload5 = await makeUpload({
      createdAt: dayjs().subtract(4, "days").toDate(),
      name: namePattern,
    });

    let sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "desc",
    });

    expect(isRight(sut)).toBe(true);

    let result = unwrapEither(sut);

    expect(result.total).toBe(5);
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload1.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload5.id }),
    ]);

    sut = await getUploads({
      searchQuery: namePattern,
      sortBy: "createdAt",
      sortDirection: "asc",
    });

    expect(isRight(sut)).toBe(true);

    result = unwrapEither(sut);

    expect(result.total).toBe(5);
    expect(result.uploads).toEqual([
      expect.objectContaining({ id: upload5.id }),
      expect.objectContaining({ id: upload4.id }),
      expect.objectContaining({ id: upload3.id }),
      expect.objectContaining({ id: upload2.id }),
      expect.objectContaining({ id: upload1.id }),
    ]);
  });
});
