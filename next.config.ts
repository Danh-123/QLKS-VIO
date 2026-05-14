import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Đưa biến vào bundle client (đọc từ `.env.local` khi Next load config). */
  env: {
    NEXT_PUBLIC_ADMIN_API_BASE_URL:
      process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "",
    NEXT_PUBLIC_AUTH_LOGIN_URL: process.env.NEXT_PUBLIC_AUTH_LOGIN_URL ?? "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
