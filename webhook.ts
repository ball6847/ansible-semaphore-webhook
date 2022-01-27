import { Router } from "./deno_modules/oak.ts";
import {
  isIn,
  isNumeric,
  required,
  validate,
} from "./deno_modules/validasaur.ts";
import { env } from "./env.ts";

export const webhook = new Router().get(
  "/trigger/:projectId/:templateId",
  async (ctx) => {
    const inputs = {
      projectId: ctx.params.projectId,
      templateId: ctx.params.templateId,
      token: ctx.request.url.searchParams.get("token"),
    };

    const [passes, errors] = await validate(inputs, {
      projectId: [required, isNumeric],
      templateId: [required, isNumeric],
      token: [required, isIn([env.WEBHOOK_TOKEN])],
    });

    if (passes === false) {
      ctx.response.body = {
        error: "ValidationError",
        data: errors,
      };
      ctx.response.status = 401;
      return;
    }

    const data = {
      message: "Hello World",
      projectId: +inputs.projectId,
      templateId: +inputs.templateId,
    };

    ctx.response.body = data;
  },
);
