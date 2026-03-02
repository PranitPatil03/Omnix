export default {
  providers: [
    {
      // better-auth serves JWKS at /api/auth/.well-known/jwks.json
      // so domain must include /api/auth path
      // Set BETTER_AUTH_URL to your app base URL (e.g. http://localhost:3000)
      domain: process.env.BETTER_AUTH_URL + "/api/auth",
      applicationID: "convex",
    },
  ]
};
