import { gql } from '@apollo/client';

// 查询定义
export const GET_CHAT_HISTORY = gql`
  query GetChatHistory {
    getChatHistory {
      id
      role
      content
      timestamp
    }
  }
`;

export const HEALTH_CHECK = gql`
  query HealthCheck {
    health
  }
`;

// 变更定义
export const SEND_CHAT_MESSAGE = gql`
  mutation SendChatMessage($input: ChatInput!) {
    sendChatMessage(input: $input) {
      success
      message {
        id
        role
        content
        timestamp
      }
      error
    }
  }
`;

export const CLEAR_CHAT_HISTORY = gql`
  mutation ClearChatHistory {
    clearChatHistory
  }
`;

// 订阅定义（为未来的实时功能预留）
export const MESSAGE_ADDED_SUBSCRIPTION = gql`
  subscription MessageAdded {
    messageAdded {
      id
      role
      content
      timestamp
    }
  }
`;

// TypeScript类型定义
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatInput {
  message: string;
  systemMessage?: string;
  model?: string;
}

export interface ChatResponse {
  success: boolean;
  message?: Message;
  error?: string;
}

// 查询结果类型
export interface GetChatHistoryData {
  getChatHistory: Message[];
}

export interface HealthCheckData {
  health: string;
}

// 变更结果类型
export interface SendChatMessageData {
  sendChatMessage: ChatResponse;
}

export interface ClearChatHistoryData {
  clearChatHistory: boolean;
}

// 变更变量类型
export interface SendChatMessageVariables {
  input: ChatInput;
}