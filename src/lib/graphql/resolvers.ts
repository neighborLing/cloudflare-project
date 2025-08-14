// GraphQL Resolvers 实现

// 模拟的聊天历史存储（实际项目中应该使用数据库）
let chatHistory: Array<{
  id: string;
  role: string;
  content: string;
  timestamp: string;
}> = [];

// 模拟AI聊天API调用
async function callChatAPI(messages: any[], model: string = 'deepseek-chat') {
  try {
    // 调用实际的AI API
    const apiUrl = 'http://localhost:8787/api/chat';
    
    const requestData = {
      model: model,
      messages: messages,
      stream: false
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    
    // 检查响应数据结构
    if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
      return responseData;
    } else if (responseData.content) {
      // 处理其他格式的响应
      return {
        choices: [{
          message: {
            content: responseData.content
          }
        }]
      };
    } else {
      throw new Error('AI API返回了意外的响应格式');
    }
  } catch (error) {
    console.error('AI API调用错误:', error);
    throw new Error(`AI API调用失败: ${error}`);
  }
}

export const resolvers = {
  Query: {
    // 获取聊天历史
    getChatHistory: () => {
      return chatHistory;
    },
    
    // 健康检查
    health: () => {
      return 'GraphQL服务运行正常！💖';
    },
  },

  Mutation: {
    // 发送聊天消息
    sendChatMessage: async (_: any, { input }: { input: any }) => {
      try {
        const { message, systemMessage = 'You are a helpful assistant.', model = 'deepseek-chat' } = input;
        
        // 创建用户消息
        const userMessage = {
          id: Date.now().toString(),
          role: 'user',
          content: message,
          timestamp: new Date().toISOString(),
        };
        
        // 添加到历史记录
        chatHistory.push(userMessage);
        
        // 准备发送给AI的消息
        const apiMessages = [
          { role: 'system', content: systemMessage },
          ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
        ];
        
        // 调用AI API
        const aiResponse = await callChatAPI(apiMessages, model);
        
        // 创建AI回复消息
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiResponse.choices[0].message.content,
          timestamp: new Date().toISOString(),
        };
        
        // 添加到历史记录
        chatHistory.push(aiMessage);
        
        return {
          success: true,
          message: aiMessage,
          error: null,
        };
      } catch (error) {
        return {
          success: false,
          message: null,
          error: error instanceof Error ? error.message : '未知错误',
        };
      }
    },
    
    // 清空聊天历史
    clearChatHistory: () => {
      chatHistory = [];
      return true;
    },
  },

  Subscription: {
    // 消息更新订阅（为未来的实时功能预留）
    messageAdded: {
      // 这里可以实现WebSocket订阅逻辑
      subscribe: () => {
        // 返回异步迭代器
      },
    },
  },
};

export default resolvers;