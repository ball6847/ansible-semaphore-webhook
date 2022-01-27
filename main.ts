import { Application } from "./deno_modules/oak.ts";
import { validate } from "./deno_modules/validasaur.ts";
import { env, envRules } from "./utils/env.ts";
import { router } from "./router.ts";

// validate environment variables before starting the application
const [envPasses, envError] = await validate(env, envRules);

if (envPasses === false) {
  console.error("ENV validation failed");
  console.error(envError);
  throw new Error("ENV validation error");
}

// register root router
const app = new Application().use(router.routes());

// start application
await app.listen({ port: 8000 });
