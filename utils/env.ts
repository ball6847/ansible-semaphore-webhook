import { config } from "../deno_modules/dotenv.ts";
import { either, required, startsWith } from "../deno_modules/validasaur.ts";

export type Env = {
  WEBHOOK_TOKEN: string;
  SEMAPHORE_URL: string;
  SEMAPHORE_USER: string;
  SEMAPHORE_PASSWORD: string;
};

export const env = config({ safe: true }) as Env;

export const envRules = {
  WEBHOOK_TOKEN: [required],
  SEMAPHORE_URL: [
    required,
    either([startsWith("http://"), startsWith("https://")]),
  ],
  SEMAPHORE_USER: [required],
  SEMAPHORE_PASSWORD: [required],
};
