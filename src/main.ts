import { assertEnv, env } from "$app/utils/env.ts";
import { App } from "alosaur";
import { plainToInstance } from "class-transformer";
import { LOGGER, loggerFactory } from "./logger.ts";
import { WebhookModule } from "./webhook/webhook.module.ts";

const [envPasses] = await assertEnv();

if (envPasses === false) {
  throw new Error("ENV validation error");
}

const app = new App({
  areas: [WebhookModule],
  providers: [{
    token: LOGGER,
    useFactory: loggerFactory,
  }],
});

// added transform function to parse request body
app.useTransform({
  type: "body",
  // deno-lint-ignore no-explicit-any
  getTransform: (transform: any, body: any) => {
    return plainToInstance(transform, body);
  },
});

app.listen({ port: env.HTTP_PORT });
