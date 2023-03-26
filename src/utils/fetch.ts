import { CookieJar, wrapFetch } from "another_cookiejar";

export const cookieJar = new CookieJar();
export const fetch = wrapFetch({ cookieJar });
