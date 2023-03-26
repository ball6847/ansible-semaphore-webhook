import { Response, RouterContext } from "oak";

export type Handler = (
  ctx: RouterContext<string>,
) => Partial<Response> | Promise<Partial<Response>>;

export const wrapJsonHandler =
  (handler: Handler) => async (ctx: RouterContext<string>): Promise<void> => {
    ctx.response.headers.set("Content-Type", "application/json");

    const maybePromise = handler(ctx);

    if (!("then" in maybePromise)) {
      Object.assign(ctx.response, maybePromise);
      return;
    }

    try {
      const response = await maybePromise;
      Object.assign(ctx.response, response);
    } catch (error) {
      Object.assign(ctx.response, {
        status: 500,
        body: {
          error: error.message,
        },
      });
    }
  };
