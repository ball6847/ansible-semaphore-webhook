import { fetch } from "./fetch.ts";

/**
 * indicate that library cannot authenticate user to ansible semaphore server
 * will be thrown when no active session and authentication attempt failed
 */
export class AnsibleSemaphoreAuthenticationError extends Error {}

type TriggerOption = {
  url: string;
  user: string;
  password: string;
};

/**
 * Trigger a task
 *
 * @param projectId semaphore project id to trigger
 * @param templateId semaphore template id to trigger
 * @param option information about semaphore instance
 * @returns task id if success, false otherwise
 * @throws `AnsibleSemaphoreAuthenticationError` if no session and authentication attempt failed
 */
export async function triggerTask(
  projectId: number,
  templateId: number,
  option: TriggerOption,
): Promise<number | false> {
  if (!ping(option) && !authenticate(option)) {
    throw new AnsibleSemaphoreAuthenticationError();
  }
  const url = `${option.url}/api/project/${projectId}/tasks`;
  const data = {
    project_id: projectId,
    template_id: templateId,
    commit_hash: null,
  };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  if (response.status !== 201) {
    return false;
  }
  const task = await response.json();
  return task.id;
}

/**
 * Authenticate user against ansible semaphore instance
 *
 * @param option information about semaphore instance
 * @returns true on success, false otherwise
 */
async function authenticate(option: TriggerOption): Promise<boolean> {
  const url = `${option.url}/api/auth/login`;
  const data = {
    auth: option.user,
    password: option.password,
  };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "content-type": "application/json",
    },
  });
  return response.status === 204;
}

/**
 * Ping - simply call to `/api/user` endpoint to check if we still have active session
 *
 * @param option information about semaphore instance
 * @returns true if session is still active, false otherwise
 */
async function ping(option: TriggerOption): Promise<boolean> {
  const url = `${option.url}/api/user`;
  const response = await fetch(url);
  return response.status !== 200;
}
