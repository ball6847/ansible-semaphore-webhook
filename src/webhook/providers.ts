export type SemaphoreOption = {
  url: string;
  user: string;
  password: string;
};

export const SEMAPHORE_OPTION = Symbol("SEMAPHORE_OPTION");

export const SEMAPHORE_CLIENT = Symbol("SEMAPHORE_CLIENT");
