import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });
config({ path: ".env.local", override: true });

const databaseUrl = process.env.POSTGRES_URL;
if (!databaseUrl) {
  throw new Error("POSTGRES_URL is required for Drizzle migrations");
}

export default defineConfig({
  out: "./drizzle/migrations",
  schema: "./lib/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: { url: databaseUrl },
});
