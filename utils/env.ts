const CLERK_PUBLISHABLE_KEY = process.env.PLASMO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error("missing clerk publishable key");
}

const env = { CLERK_PUBLISHABLE_KEY };

export default env;
