import { Router } from "./deno_modules/oak.ts";
import {
  isIn,
  isNumeric,
  required,
  validate,
} from "./deno_modules/validasaur.ts";
import { env } from "./utils/env.ts";
import { triggerTask } from "./utils/semaphore.ts";

export const webhook = new Router()
  .post(
    "/trigger/:projectId/:templateId",
    async (ctx) => {
      const body = await ctx.request.body().value;

      // gathering inputs
      const inputs = {
        projectId: ctx.params.projectId,
        templateId: ctx.params.templateId,
        environment: body.environment || null,
        token: ctx.request.url.searchParams.get("token"),
      };

      // validate inputs
      const [passes, errors] = await validate(inputs, {
        projectId: [required, isNumeric],
        templateId: [required, isNumeric],
        token: [required, isIn([env.WEBHOOK_TOKEN])],
      });

      // raise BadRequestError on validation failed
      if (passes === false) {
        ctx.response.body = {
          error: "ValidationError",
          data: errors,
        };
        ctx.response.status = 400;
        return;
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
        console.error(result.message);
        console.error(result.cause);
        ctx.response.body = {
          error: "WebhookTriggerError",
        };
        ctx.response.status = 500;
        return;
      }

      // return created task id on success
      ctx.response.body = { task_id: result };
      ctx.response.status = 201;
    },
  );
