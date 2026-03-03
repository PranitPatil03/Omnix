import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const auth: any = convexBetterAuthNextJs({
  convexUrl: process.env.NEXT_PUBLIC_CONVEX_URL!,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
});

export const handler: { GET: (req: Request) => Promise<Response>; POST: (req: Request) => Promise<Response> } = auth.handler;
export const preloadAuthQuery = auth.preloadAuthQuery;
export const isAuthenticated: () => Promise<boolean> = auth.isAuthenticated;
export const getToken: () => Promise<string | null> = auth.getToken;
export const fetchAuthQuery = auth.fetchAuthQuery;
export const fetchAuthMutation = auth.fetchAuthMutation;
export const fetchAuthAction = auth.fetchAuthAction;
