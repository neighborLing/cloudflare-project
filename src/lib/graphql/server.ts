import { ApolloServer } from '@apollo/server';
import { NextRequest, NextResponse } from 'next/server';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

// 创建Apollo Server实例
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // 开发环境下启用GraphQL Playground
  introspection: process.env.NODE_ENV !== 'production',
  // 格式化错误信息
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      // 开发环境下显示详细错误信息
      ...(process.env.NODE_ENV !== 'production' && {
        locations: error.locations,
        path: error.path,
        extensions: error.extensions,
      }),
    };
  },
});

// 启动服务器
let serverStarted = false;

async function startServer() {
  if (!serverStarted) {
    await server.start();
    serverStarted = true;
  }
}

// 创建GraphQL处理函数
export async function createGraphQLHandler() {
  await startServer();
  
  return async function handler(req: NextRequest) {
    try {
      const body = await req.text();
      const { query, variables, operationName } = JSON.parse(body || '{}');
      
      const result = await server.executeOperation({
        query,
        variables,
        operationName,
      }, {
        contextValue: {
          req,
          // 可以添加用户信息、数据库连接等
        },
      });
      
      return NextResponse.json(result, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    } catch (error) {
      console.error('GraphQL Handler Error:', error);
      return NextResponse.json(
        { errors: [{ message: 'Internal server error' }] },
        { status: 500 }
      );
    }
  };
}

export { server };