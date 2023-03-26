import { env } from "$app/utils/env.ts";
import {
  Body,
  Content,
  Controller,
  Inject,
  Param,
  Post,
  QueryParam,
} from "alosaur";
import { getLogger } from "log";
import { Logger } from "../logger.ts";
import { SemaphoreClient } from "./lib/semaphore-client.ts";
import { TriggerPayload } from "./payloads.ts";
import { SEMAPHORE_CLIENT } from "./providers.ts";

@Controller("/webhook")
export class WebhookController {
  #semaphoreClient: SemaphoreClient;
  #logger: Logger;

  constructor(
    @Inject(SEMAPHORE_CLIENT) semaphoreClient: SemaphoreClient,
  ) {
    this.#semaphoreClient = semaphoreClient;
    this.#logger = getLogger("WebhookController");
  }

  @Post("/trigger/:projectId/:templateId")
  async index(
    @Param("projectId") projectId: string,
    @Param("templateId") templateId: string,
    @QueryParam("token") token: string,
    @Body(TriggerPayload) payload: TriggerPayload,
  ) {
    this.#logger.info(
      `got webhook request, ${JSON.stringify({ projectId, templateId })}`,
    );

    if (token !== env.WEBHOOK_TOKEN) {
      this.#logger.error(`invalid token, ${token}`);
      return Content({ error: "Invalid token" }, 401);
    }

    // trigger ansible task
    const result = await this.#semaphoreClient.triggerTask(
      +projectId,
      +templateId,
      payload.environment,
    );

    // raise InternalServerError on task triggering failed
    if (result instanceof Error) {
      this.#logger.error(result.message);
      return Content({ error: "WebhookTriggerError" }, 500);
    }

    this.#logger.info(`triggered task, ${result}`);

    // return created task id on success
    return Content({ task_id: result }, 201);
  }
}
