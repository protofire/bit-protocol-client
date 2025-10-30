/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    // Solo usar proxy en desarrollo
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/bot/:path*",
          destination: `${
            process.env.BACKEND_API_URL || "http://192.168.0.119/v1"
          }/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
