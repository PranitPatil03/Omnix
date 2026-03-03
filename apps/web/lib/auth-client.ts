import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

const client = createAuthClient({
  plugins: [
    organizationClient(),
    convexClient(),
  ],
});

export const authClient = client;

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  organization,
  useActiveOrganization,
  useListOrganizations,
} = client;
