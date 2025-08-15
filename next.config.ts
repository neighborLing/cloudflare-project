import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 配置 - 支持 API 路由
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // 配置静态导出
  distDir: 'dist',
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
  }),
  // 排除缓存文件和不必要的文件
  webpack: (config, { isServer }) => {
    // 确保缓存不被包含在输出中
    config.cache = false;
    return config;
  }
};

export default nextConfig;
