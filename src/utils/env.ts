import { configAsync } from "dotenv";
import { either, isNumeric, required, startsWith, validate } from "validasaur";

// pre loading configuration from .env file
await configAsync({
  safe: true,
  export: true,
});

export type Env = {
  HTTP_PORT: number;
  WEBHOOK_TOKEN: string;
  SEMAPHORE_URL: string;
  SEMAPHORE_USER: string;
  SEMAPHORE_PASSWORD: string;
};

// gathering configuration from env
export const env: Env = {
  HTTP_PORT: Number(Deno.env.get("HTTP_PORT")),
  WEBHOOK_TOKEN: Deno.env.get("WEBHOOK_TOKEN") || "",
  SEMAPHORE_URL: Deno.env.get("SEMAPHORE_URL") || "",
  SEMAPHORE_USER: Deno.env.get("SEMAPHORE_USER") || "",
  SEMAPHORE_PASSWORD: Deno.env.get("SEMAPHORE_PASSWORD") || "",
};

// prepare rules for extra validation
const rules = {
  HTTP_PORT: [required, isNumeric],
  WEBHOOK_TOKEN: [required],
  SEMAPHORE_URL: [
    required,
    either([startsWith("http://"), startsWith("https://")]),
  ],
  SEMAPHORE_USER: [required],
  SEMAPHORE_PASSWORD: [required],
};

// validate all env entries
// should be import and invoke at application startup
export async function assertEnv() {
  return await validate(env, rules);
}
