import { config } from "../deno_modules/dotenv.ts";
import {
  either,
  isNumeric,
  required,
  startsWith,
} from "../deno_modules/validasaur.ts";

export type Env = {
  HTTP_PORT: string;
  WEBHOOK_TOKEN: string;
  SEMAPHORE_URL: string;
  SEMAPHORE_USER: string;
  SEMAPHORE_PASSWORD: string;
};

export const env = config({ safe: true }) as Env;

export const envRules = {
  HTTP_PORT: [required, isNumeric],
  WEBHOOK_TOKEN: [required],
  SEMAPHORE_URL: [
    required,
    either([startsWith("http://"), startsWith("https://")]),
  ],
  SEMAPHORE_USER: [required],
  SEMAPHORE_PASSWORD: [required],
};
