/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Force dynamic rendering to avoid wallet adapter issues
  dynamic: 'force-dynamic',
  output: 'standalone',
};

export default nextConfig;
