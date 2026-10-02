import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["192.168.1.19"],
  // Images/videos are served from public/images/ (the old
  // warriorcomics.com/Content host no longer exists — this app replaced it).
};

export default nextConfig;
