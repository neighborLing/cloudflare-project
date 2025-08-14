import { gql } from 'graphql-tag';

// GraphQL Schema 定义
export const typeDefs = gql`
  # 消息类型定义
  type Message {
    id: ID!
    role: String!
    content: String!
    timestamp: String!
  }

  # 聊天输入类型
  input ChatInput {
    message: String!
    systemMessage: String
    model: String
  }

  # 聊天响应类型
  type ChatResponse {
    success: Boolean!
    message: Message
    error: String
  }

  # 查询类型
  type Query {
    # 获取聊天历史
    getChatHistory: [Message!]!
    # 健康检查
    health: String!
  }

  # 变更类型
  type Mutation {
    # 发送聊天消息
    sendChatMessage(input: ChatInput!): ChatResponse!
    # 清空聊天历史
    clearChatHistory: Boolean!
  }

  # 订阅类型（为未来的实时功能预留）
  type Subscription {
    # 消息更新订阅
    messageAdded: Message!
  }
`;

export default typeDefs;