import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const config = {
  supabase: {
    url: process.env.SUPABASE_URL ?? "",
    anonKey: process.env.SUPABASE_ANON_KEY ?? "",
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
    baseURL: process.env.OPENAI_API_BASE_URL ?? "",
  },
  chromePath: process.env.CHROME_PATH,
  embedModel: process.env.EMBED_MODEL ?? "text-embedding-3-small",
};
