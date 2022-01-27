import { Router } from './deno_modules/oak.ts';

// curl -H "x-webhook-token: ${TOKEN}" https://ansible-webhook.sourcelab.xyz/trigger/:project/:template

export const webhook = new Router().get(
  '/trigger/:project/:template',
  (ctx) => {
    ctx.response.body = {
      message: 'Hello World',
    };
  }
);
