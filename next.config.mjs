/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Disable Strict Mode (temporary fix for react-quill)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all remote images
      },
    ],
  },
};

export default nextConfig;
