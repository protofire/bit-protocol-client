/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    const isPreview = process.env.VERCEL_ENV === "preview";
    const isDevelopment = process.env.NODE_ENV === "development";

    if (isDevelopment || isPreview) {
      return [
        {
          source: "/api/bot/:path*",
          destination: `${
            process.env.BACKEND_API_URL || "https://api.bitusd.finance/v1"
          }/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
