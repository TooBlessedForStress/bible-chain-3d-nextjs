/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,   // Temporary — we can remove later
  },
  experimental: {
    // Helps with some provider compatibility issues
  },
};

export default nextConfig;
