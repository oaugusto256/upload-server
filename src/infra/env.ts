import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
})

const _env = envSchema.parse(process.env)

export const env = _env
