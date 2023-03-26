import { webhookHandler } from "$app/handlers/webhook.ts";
import { wrapJsonHandler } from "$app/utils/handler.ts";
import { Router } from "oak";

const webhook = new Router()
  .post(
    "/trigger/:projectId/:templateId",
    wrapJsonHandler(webhookHandler),
  );

export const router = new Router()
  .use(
    "/webhook",
    webhook.routes(),
    webhook.allowedMethods(),
  );
