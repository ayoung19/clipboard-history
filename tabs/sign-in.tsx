import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/chrome-extension";

import env from "~utils/env";

function SignInPage() {
  return (
    <ClerkProvider publishableKey={env.CLERK_PUBLISHABLE_KEY}>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </ClerkProvider>
  );
}

export default SignInPage;
