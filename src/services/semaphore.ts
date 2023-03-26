import { fetch } from "$app/utils/fetch.ts";

export class AnsibleSemaphoreAuthenticationError extends Error {}

type TriggerOption = {
  url: string;
  user: string;
  password: string;
  environment?: Record<string, string> | null;
};

export async function triggerTask(
  projectId: number,
  templateId: number,
  option: TriggerOption,
): Promise<number | Error> {
  if (!await ping(option) && !await authenticate(option)) {
    throw new AnsibleSemaphoreAuthenticationError();
  }
  const url = `${option.url}/api/project/${projectId}/tasks`;
  const data = {
    project_id: projectId,
    template_id: templateId,
    commit_hash: null,
    environment: option.environment ? JSON.stringify(option.environment) : "{}",
  };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  if (response.status !== 201) {
    const err = new Error(
      `Failed to trigger task: ${response.status} ${response.statusText}`,
    );
    err.cause = await response.text();
    return err;
    // return false;
  }
  const task = await response.json();
  return task.id;
}

async function authenticate(option: TriggerOption): Promise<boolean> {
  const url = `${option.url}/api/auth/login`;
  const data = {
    auth: option.user,
    password: option.password,
  };
  if (Deno.env.get("DEBUG")) {
    console.debug("authenticating to semaphore", { url, data });
  }
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  return response.status === 204;
}

async function ping(option: TriggerOption): Promise<boolean> {
  const url = `${option.url}/api/user`;
  const response = await fetch(url);
  return response.status === 200;
}
