const CLERK_PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("missing clerk publishable key");
}

const INSTANT_APP_ID = process.env.PLASMO_PUBLIC_INSTANT_APP_ID;

if (!INSTANT_APP_ID) {
  throw new Error("missing instant app id");
}

const BASE_URL = process.env.PLASMO_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error("missing base url");
}

const env = { CLERK_PUBLISHABLE_KEY, INSTANT_APP_ID, BASE_URL };

export default env;
