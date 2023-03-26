import { Router } from "oak";
import { webhook } from "./webhook.ts";

export const router = new Router()
  .use(
    "/webhook",
    webhook.routes(),
    webhook.allowedMethods(),
  );
