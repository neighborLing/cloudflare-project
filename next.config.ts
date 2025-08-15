import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 配置 - 支持 API 路由
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
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
