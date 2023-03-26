import { env } from "$app/utils/env.ts";
import { Area } from "alosaur";
import { SemaphoreClient } from "./lib/semaphore-client.ts";
import { SEMAPHORE_CLIENT, SEMAPHORE_OPTION } from "./providers.ts";
import { WebhookController } from "./webhook.controller.ts";

@Area({
  controllers: [WebhookController],
  providers: [{
    token: SEMAPHORE_OPTION,
    useValue: {
      url: env.SEMAPHORE_URL,
      user: env.SEMAPHORE_USER,
      password: env.SEMAPHORE_PASSWORD,
    },
  }, {
    token: SEMAPHORE_CLIENT,
    useClass: SemaphoreClient,
  }],
})
export class WebhookModule {}
