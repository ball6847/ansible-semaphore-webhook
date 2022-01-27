import { config } from "./deno_modules/dotenv.ts";
import { either, required, startsWith } from "./deno_modules/validasaur.ts";

export const env = config({ safe: true });

export const envRules = {
  WEBHOOK_TOKEN: [required],
  SEMAPHORE_URL: [
    required,
    either([startsWith("http://"), startsWith("https://")]),
  ],
  SEMAPHORE_USER: [required],
  SEMAPHORE_PASSWORD: [required],
};
