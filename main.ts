import { Application } from './deno_modules/oak.ts';
import { validate } from './deno_modules/validasaur.ts';
import { env, envRules } from './env.ts';
import { router } from './router.ts';

const [envPasses, envError] = await validate(env, envRules);

if (envPasses === false) {
  console.error('ENV validation failed');
  console.error(envError);
  throw new Error('ENV validation error');
}

const app = new Application().use(router.routes());

await app.listen({ port: 8000 });
