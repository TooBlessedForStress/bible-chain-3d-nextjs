/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // This is the key fix for the wallet adapter error
  experimental: {
    serverComponentsExternalPackages: ["@solana/web3.js", "@coral-xyz/anchor"],
  },
  // Disable static generation for the whole app for now
  output: 'standalone',
};

export default nextConfig;
