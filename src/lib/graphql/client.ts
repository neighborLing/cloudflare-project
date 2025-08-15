import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';

// HTTP链接配置
const httpLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'same-origin',
});

// 错误处理链接
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`Network error: ${networkError}`);
  }
});

// 认证链接（可以在这里添加token等）
const authLink = setContext((_, { headers }) => {
  // 可以从localStorage或其他地方获取token
  // const token = localStorage.getItem('token');
  
  return {
    headers: {
      ...headers,
      // authorization: token ? `Bearer ${token}` : "",
      'Content-Type': 'application/json',
    }
  };
});

// 创建Apollo Client实例
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    // 缓存配置
    typePolicies: {
      Message: {
        fields: {
          timestamp: {
            // 时间戳字段的缓存策略
            merge: false,
          },
        },
      },
    },
  }),
  // 开发环境下启用调试
  connectToDevTools: process.env.NODE_ENV !== 'production',
  // 默认查询选项
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default apolloClient;