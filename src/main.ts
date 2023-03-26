import { Application } from "oak";
import oak_logger from "oak_logger";
import { logger } from "./ioc/logger.ts";
import { router } from "./router.ts";
import { assertEnv, env } from "./utils/env.ts";

// validate environment variables before starting the application
const [envPasses, envError] = await assertEnv();

if (envPasses === false) {
  console.error("ENV validation failed");
  console.error(envError);
  throw new Error("ENV validation error");
}

// register root router
const app = new Application()
  .use(oak_logger.logger)
  .use(oak_logger.responseTime)
  .use(router.routes());

logger.info(`Server started on port ${env.HTTP_PORT}`);

// start application
await app.listen({ port: env.HTTP_PORT });
