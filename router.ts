import { Router } from "./deno_modules/oak.ts";
import { webhook } from "./webhook.ts";

export const router = new Router()
  .use(
    "/webhook",
    webhook.routes(),
    webhook.allowedMethods(),
  );
