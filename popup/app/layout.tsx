import { ClerkProvider } from "@clerk/chrome-extension";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import env from "~utils/env";

export default function RootLayout() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={env.CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
    >
      <Outlet />
    </ClerkProvider>
  );
}
