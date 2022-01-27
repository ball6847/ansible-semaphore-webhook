import { Application } from './deno_modules/oak.ts';
import { router } from './router.ts';

const app = new Application().use(router.routes(), router.allowedMethods());

await app.listen({ port: 8000 });
