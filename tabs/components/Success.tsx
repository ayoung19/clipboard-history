import { useAuth } from "@clerk/chrome-extension";
import { init, type User } from "@instantdb/react";
import { Text } from "@mantine/core";
import { useEffect } from "react";

import schema from "~instant.schema";
import { setRefreshToken } from "~storage/refreshToken";
import env from "~utils/env";

const db = init({ appId: "78454a07-da4f-4166-a5b4-baf13dcca563", schema: schema });

export const Success = () => {
  const { getToken } = useAuth();

  const signInToInstantWithClerkToken = async () => {
    // getToken gets the jwt from Clerk for your signed in user.
    const idToken = await getToken();

    if (!idToken) {
      // No jwt, can't sign in to instant
      return;
    }

    // Create a long-lived session with Instant for your clerk user
    // It will look up the user by email or create a new user with
    // the email address in the session token.
    db.auth.signInWithIdToken({
      clientName: "clerk",
      idToken: idToken,
    });
  };

  useEffect(() => {
    signInToInstantWithClerkToken();
  }, []);

  const { user } = db.useAuth();

  const setRefreshTokenAndRedirectIfNotSubscribed = async (user: User) => {
    await setRefreshToken(user.refresh_token);

    const { data } = await db.queryOnce({ subscriptions: {} });

    if (data.subscriptions.length !== 0) {
      return;
    }

    window.location.replace(`${env.BASE_URL}/checkout/${user.id}`);
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    setRefreshTokenAndRedirectIfNotSubscribed(user);
  }, [user]);

  return <Text>Success! You may close this window.</Text>;
};
