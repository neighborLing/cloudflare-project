import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 移除 output: 'export' 以支持 API 路由
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // 移除 distDir 配置，使用默认的 .next 目录
  images: {
    unoptimized: true
  },
  // 优化构建以减少文件大小
  experimental: {
    optimizeCss: true,
  },
  // 压缩配置
  compress: true,
  // 生产环境优化
  ...(process.env.NODE_ENV === 'production' && {
    generateBuildId: () => 'build',
  })
};

export default nextConfig;
