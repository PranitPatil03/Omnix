/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  typescript: {
    // Backend package has type inference issues with better-call in pnpm monorepo
    ignoreBuildErrors: true,
  },
}

export default nextConfig
