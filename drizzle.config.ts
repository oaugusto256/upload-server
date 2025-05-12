import type { Config } from "drizzle-kit";

export default {
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  dialect: "postgresql",
  schema: "src/infra/db/schemas/*",
  out: "src/infra/db/migrations",
} satisfies Config;
