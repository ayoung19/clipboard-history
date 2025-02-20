import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/chrome-extension";
import { Center } from "@mantine/core";

import env from "~utils/env";

import "./sign-in.css";

import { Success } from "./components/Success";

export default function Page() {
  return (
    <ClerkProvider
      publishableKey={env.CLERK_PUBLISHABLE_KEY}
      afterSignOutUrl={chrome.runtime.getURL("/tabs/sign-in.html")}
      signInFallbackRedirectUrl={chrome.runtime.getURL("/tabs/sign-in.html")}
      signUpFallbackRedirectUrl={chrome.runtime.getURL("/tabs/sign-in.html")}
    >
      <SignedOut>
        <Center h="100%">
          <SignIn />
        </Center>
      </SignedOut>
      <SignedIn>
        <Success />
      </SignedIn>
    </ClerkProvider>
  );
}
