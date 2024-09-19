import { SignIn, SignUp } from "@clerk/chrome-extension";
import { Box, MantineProvider, Modal } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, Navigate, RouterProvider } from "react-router-dom";

import EntriesPage from "./app/entries/page";
import RootLayout from "./app/layout";

const router = createMemoryRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/sign-in" replace />,
      },
      {
        path: "/entries",
        element: <EntriesPage />,
      },
      {
        path: "/sign-in/*",
        element: (
          <Box p="xl">
            <SignIn signUpUrl="/sign-up" />
          </Box>
        ),
      },
      {
        path: "/sign-up/*",
        element: (
          <Box p="xl">
            <SignUp signInUrl="/sign-in" />
          </Box>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

export default function IndexPopup() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </MantineProvider>
  );
}
