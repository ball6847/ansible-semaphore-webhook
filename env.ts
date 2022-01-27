import { config } from './deno_modules/dotenv.ts';
import {
  validate,
  required,
  startsWith,
  either,
} from './deno_modules/validasaur.ts';

export const env = config({ safe: true });

export const envRules = {
  WEBHOOK_TOKEN: [required],
  SEMAPHORE_URL: [
    required,
    either([startsWith('http://'), startsWith('https://')]),
  ],
  SEMAPHORE_USER: [required],
  SEMAPHORE_PASSWORD: [required],
};

// validate env, to make sure it has been correctly defined
export async function validateEnv() {
  const [passes, error] = await validate(env, envRules);

  if (passes === false) {
  }
}
