'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import {
  SEND_CHAT_MESSAGE,
  GET_CHAT_HISTORY,
  CLEAR_CHAT_HISTORY,
  type Message,
  type SendChatMessageVariables,
} from '@/lib/graphql/queries';

export default function GraphQLChatPage() {
  const [inputMessage, setInputMessage] = useState('');
  const [systemMessage, setSystemMessage] = useState('You are a helpful assistant.');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // GraphQL查询和变更
  const { data: chatData, loading: historyLoading, refetch } = useQuery(GET_CHAT_HISTORY);
  const [sendMessage, { loading: sendingMessage }] = useMutation(SEND_CHAT_MESSAGE);
  const [clearHistory] = useMutation(CLEAR_CHAT_HISTORY);

  const messages: Message[] = chatData?.getChatHistory || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sendingMessage) return;

    try {
      const variables: SendChatMessageVariables = {
        input: {
          message: inputMessage,
          systemMessage,
          model: 'deepseek-chat',
        },
      };

      await sendMessage({ variables });
      setInputMessage('');
      // 重新获取聊天历史
      await refetch();
    } catch (error) {
      console.error('发送消息失败:', error);
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistory();
      await refetch();
    } catch (error) {
      console.error('清空历史失败:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex-1 text-center">🚀 GraphQL AI聊天</h1>
            <div className="flex gap-2">
              <button
                onClick={handleClearHistory}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
                title="清空历史"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
                title="设置"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-2 text-center text-blue-100">
            <span className="text-sm">✨ 基于GraphQL的现代化聊天体验 ✨</span>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">⚙️ GraphQL设置</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">系统提示:</label>
                  <textarea
                    value={systemMessage}
                    onChange={(e) => setSystemMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                    placeholder="设置AI角色"
                    rows={3}
                  />
                </div>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-700">
                    💡 这个版本使用GraphQL进行数据交互，
                    提供更灵活的API查询能力！
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                >
                  保存设置 💘
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {historyLoading ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-lg">加载聊天历史中...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">🚀</div>
              <p className="text-lg">开始你的GraphQL AI对话吧～</p>
              <p className="text-sm mt-2">支持Markdown格式显示，数据通过GraphQL传输💘</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-2xl px-4 py-3 break-words overflow-wrap-anywhere ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          code: ({ node, className, children, ...props }: any) => {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;
                            return !isInline && match ? (
                              <SyntaxHighlighter
                                style={tomorrow as any}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg text-sm"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-purple-100 text-purple-800 px-1 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            );
                          },
                          h1: ({ children }) => <h1 className="text-xl font-bold text-gray-800 mb-2 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold text-gray-800 mb-2 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-base font-bold text-gray-800 mb-1 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</h3>,
                          p: ({ children }) => <p className="text-gray-700 mb-2 leading-relaxed break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside text-gray-700 mb-2 space-y-1 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside text-gray-700 mb-2 space-y-1 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</ol>,
                          li: ({ children }) => <li className="text-gray-700 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-blue-300 bg-blue-50 pl-4 py-2 my-2 italic text-gray-600 break-words overflow-wrap-anywhere whitespace-break-spaces">
                              {children}
                            </blockquote>
                          ),
                        }}
                      >
                        {message.content || '💭 AI正在思考中...'}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere whitespace-break-spaces">{message.content}</p>
                  )}
                  <div className="text-xs opacity-70 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex space-x-4">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入你的消息... (支持Markdown格式)"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-gray-800"
              rows={3}
              disabled={sendingMessage}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || sendingMessage}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
            >
              {sendingMessage ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>发送中</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>发送</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              )}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            💡 按 Enter 发送，Shift + Enter 换行 | 🚀 GraphQL驱动的现代化聊天体验
          </div>
        </div>
      </div>
    </div>
  );
}