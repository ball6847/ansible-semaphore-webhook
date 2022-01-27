import { CookieJar, wrapFetch } from "../deno_modules/another_cookiejar.ts";

const cookieJar = new CookieJar();
const fetch = wrapFetch({ cookieJar });

export { cookieJar, fetch };
