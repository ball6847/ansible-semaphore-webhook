import { logger } from "$app/ioc/logger.ts";
import { triggerTask } from "$app/services/semaphore.ts";
import { env } from "$app/utils/env.ts";
import { Handler } from "$app/utils/handler.ts";
import { isIn, isNumeric, required, validate } from "validasaur";

export const webhookHandler: Handler = async ({ request, params }) => {
  const body = await request.body().value;

  // gathering inputs
  const inputs = {
    projectId: params.projectId,
    templateId: params.templateId,
    environment: body.environment || null,
    token: request.url.searchParams.get("token"),
  };

  // validate inputs
  const [passes, errors] = await validate(inputs, {
    projectId: [required, isNumeric],
    templateId: [required, isNumeric],
    token: [required, isIn([env.WEBHOOK_TOKEN])],
  });

  // raise BadRequestError on validation failed
  if (passes === false) {
    return {
      status: 400,
      body: {
        error: "ValidationError",
        data: errors,
      },
    };
  }

  // trigger ansible task
  const result = await triggerTask(
    +inputs.projectId,
    +inputs.templateId,
    {
      url: env.SEMAPHORE_URL,
      user: env.SEMAPHORE_USER,
      password: env.SEMAPHORE_PASSWORD,
      environment: inputs.environment,
    },
  );

  // raise InternalServerError on task triggering failed
  if (result instanceof Error) {
    logger.error(result.message);
    logger.error(result.cause);
    return {
      status: 500,
      body: {
        error: "WebhookTriggerError",
      },
    };
  }

  // return created task id on success
  return {
    status: 201,
    body: {
      task_id: result,
    },
  };
};
// wrapJsonContext();
