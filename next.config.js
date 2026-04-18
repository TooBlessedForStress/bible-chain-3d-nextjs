/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Force dynamic rendering to avoid static prerender errors with wallet adapter
  dynamic: 'force-dynamic',
};

export default nextConfig;
