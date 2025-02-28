/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // Disable Turbopack
  },
  reactStrictMode: false, // Disable Strict Mode (temporary fix for react-quill)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all remote images
      },
    ],
  },
  env: {
    RESEND_API_KEY: process.env.RESEND_API_KEY, // Expose RESEND_API_KEY to the client-side
  },
};

export default nextConfig;
