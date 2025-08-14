import { createGraphQLHandler } from '@/lib/graphql/server';
import { NextRequest } from 'next/server';

// 配置动态路由
export const dynamic = 'force-dynamic';

// POST请求处理
export async function POST(request: NextRequest) {
  // 在每次请求时创建处理器，避免顶层await
  const graphqlHandler = await createGraphQLHandler();
  return graphqlHandler(request);
}

// OPTIONS请求处理（CORS预检）
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET请求处理（GraphQL Playground）
export async function GET() {
  // 在开发环境下返回GraphQL Playground
  if (process.env.NODE_ENV !== 'production') {
    return new Response(
      `
      <!DOCTYPE html>
      <html>
      <head>
        <title>GraphQL Playground</title>
        <style>
          body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            text-align: center;
            max-width: 500px;
          }
          h1 {
            color: #333;
            margin-bottom: 1rem;
          }
          .emoji {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          .info {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          .endpoint {
            background: #f5f5f5;
            padding: 1rem;
            border-radius: 8px;
            font-family: monospace;
            margin: 1rem 0;
          }
          .note {
            color: #888;
            font-size: 0.9rem;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="emoji">🚀</div>
          <h1>GraphQL API 已就绪！</h1>
          <div class="info">
            <p>你的GraphQL服务正在运行中～</p>
            <p>可以通过POST请求发送GraphQL查询到：</p>
            <div class="endpoint">/api/graphql</div>
            <p class="note">💘 用Apollo Client或其他GraphQL客户端来测试吧！</p>
          </div>
        </div>
      </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
  
  return new Response('GraphQL API is running', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}