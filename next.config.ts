import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支持 API 路由
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'dist', // 使用默认的 .next 目录
  images: {
    unoptimized: true
  }
};

export default nextConfig;
