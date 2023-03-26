import { fetch } from "$app/utils/fetch.ts";
import { Inject, Singleton } from "alosaur";
import { getLogger } from "log";
import { Logger } from "../../logger.ts";
import { SEMAPHORE_OPTION, SemaphoreOption } from "../providers.ts";

export class AuthenticationError extends Error {}

@Singleton()
export class SemaphoreClient {
  #semaphore: SemaphoreOption;
  #logger: Logger;

  constructor(
    @Inject(SEMAPHORE_OPTION) semaphore: SemaphoreOption,
  ) {
    this.#semaphore = semaphore;
    this.#logger = getLogger("SemaphoreClient");
  }

  async triggerTask(
    projectId: number,
    templateId: number,
    environment?: Record<string, unknown>,
  ): Promise<number | Error> {
    this.#logger.debug("try authenticating to semaphore");

    const authenticated = await this.#authenticate();
    if (!authenticated) {
      this.#logger.error("failed to authenticate to semaphore");
      throw new AuthenticationError();
    }

    const url = `${this.#semaphore.url}/api/project/${projectId}/tasks`;
    const data = {
      project_id: projectId,
      template_id: templateId,
      commit_hash: null,
      environment: environment ? JSON.stringify(environment) : "{}",
    };

    this.#logger.debug(`triggering task ${JSON.stringify({ url, data })}`);

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    if (response.status !== 201) {
      this.#logger.debug("failed to trigger task");

      const err = new Error(
        `Failed to trigger task: ${response.status} ${response.statusText}`,
      );
      err.cause = await response.text();
      return err;
    }

    this.#logger.debug("task triggered ok");

    const task = await response.json();
    return task.id;
  }

  async #authenticate(): Promise<boolean> {
    this.#logger.debug(
      "testing if we still have active session",
    );

    // skip authentication if already authenticated
    if (await this.#ping()) {
      this.#logger.debug("still authenticated");
      return true;
    }

    this.#logger.debug(
      "we have no active session, need to authenticate",
    );

    const url = `${this.#semaphore.url}/api/auth/login`;
    const data = {
      auth: this.#semaphore.user,
      password: this.#semaphore.password,
    };

    this.#logger.debug(
      `authenticating to semaphore ${JSON.stringify({ url, data })}`,
    );

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });

    const ok = response.status === 204;

    this.#logger.debug(
      `response ${JSON.stringify(Object.fromEntries(response.headers))}`,
    );

    if (!ok) {
      const body = await response.text();
      this.#logger.debug(
        `failed to authenticate to semaphore ${response.status} ${response.statusText}, ${
          JSON.stringify(body)
        }`,
      );
    } else {
      this.#logger.debug("authenticated ok");
    }

    return ok;
  }

  async #ping(): Promise<boolean> {
    const url = `${this.#semaphore.url}/api/user`;
    const response = await fetch(url);
    return response.status === 200;
  }
}
