import { getLogger, handlers, setup } from "log";

const level = (Deno.env.get("LOG_LEVEL") || "INFO").toUpperCase() as
  | "NOTSET"
  | "DEBUG"
  | "INFO"
  | "WARNING"
  | "ERROR"
  | "CRITICAL";

const loggerConfig = {
  level: level,
  handlers: ["console"],
};

setup({
  handlers: {
    console: new handlers.ConsoleHandler(level, {
      formatter: "[{loggerName}] - {levelName} {msg}",
    }),
  },
  // TODO: we could implement custom decorator to inject logger instead of define all loggers by hand
  loggers: {
    default: loggerConfig,
    SemaphoreClient: loggerConfig,
    WebhookController: loggerConfig,
  },
});

export const LOGGER = Symbol("LOGGER");
export type Logger = ReturnType<typeof getLogger>;
export function loggerFactory() {
  return getLogger();
}
