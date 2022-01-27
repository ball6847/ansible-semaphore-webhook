import { CookieJar, wrapFetch } from "../deno_modules/another_cookiejar.ts";

export const cookieJar = new CookieJar();
export const fetch = wrapFetch({ cookieJar });
