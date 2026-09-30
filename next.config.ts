import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.8"],
  // warriorcomics.com serves assets over plain HTTP only; proxy them so the
  // HTTPS site (Vercel) doesn't get blocked by mixed-content rules.
  async rewrites() {
    return [
      {
        source: "/wc-content/:path*",
        destination: "http://warriorcomics.com/Content/:path*",
      },
    ];
  },
};

export default nextConfig;
