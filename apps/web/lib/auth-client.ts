import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";
import { convexClient } from "@convex-dev/better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [
    organizationClient(),
    convexClient(),
  ],
});

export const {
  signIn,
  signUp,
  signOut,
  useSession,
  organization,
  useActiveOrganization,
  useListOrganizations,
} = authClient;
