'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('http://localhost:8787/api/chat');
  const [systemMessage, setSystemMessage] = useState('You are a helpful assistant.');
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // 创建AI消息占位符
    const aiMessageId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);

    try {
      const requestData = {
        model: "deepseek-chat",
        messages: [
          { "role": "system", "content": systemMessage },
          ...messages.map(msg => ({ role: msg.role, content: msg.content })),
          { "role": "user", "content": inputMessage }
        ],
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

      // 非流式响应处理
      const responseData = await response.json();
      
      // 检查响应数据结构
      if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
        // 标准的非流式响应格式
        const aiContent = responseData.choices[0].message.content;
        
        // 更新AI消息内容
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: aiContent }
            : msg
        ));
      } else {
        throw new Error('Invalid response format: missing choices or message content');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
          ? { ...msg, content: `❌ 请求失败: ${error instanceof Error ? error.message : '未知错误'}` }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex-1 text-center">💬 AI聊天助手</h1>
            <button
              onClick={() => setShowSettings(true)}
              className="ml-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
              title="设置"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">⚙️ 设置</h2>
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
                  <label className="block mb-2 font-medium text-gray-700">API地址:</label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    placeholder="输入API地址"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">系统提示:</label>
                  <textarea
                    value={systemMessage}
                    onChange={(e) => setSystemMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                    placeholder="设置AI角色"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  保存设置 💘
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-6xl mb-4">💭</div>
              <p className="text-lg">开始你的AI对话吧～</p>
              <p className="text-sm mt-2">支持Markdown格式显示哦💘</p>
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
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none break-words overflow-wrap-anywhere whitespace-break-spaces prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-em:text-gray-600 prose-code:text-purple-600 prose-code:bg-purple-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-800 prose-blockquote:border-purple-300 prose-blockquote:bg-purple-50 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700">
                      <ReactMarkdown
                        components={{
                          code({ node, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;
                            return !isInline ? (
                              <SyntaxHighlighter
                                style={tomorrow as any}
                                language={match[1]}
                                PreTag="div"
                                className="rounded-lg my-2"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className="bg-purple-100 text-purple-700 px-1 py-0.5 rounded text-sm font-mono break-words overflow-wrap-anywhere whitespace-break-spaces" {...props}>
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
                            <blockquote className="border-l-4 border-purple-300 bg-purple-50 pl-4 py-2 my-2 italic text-gray-600 break-words overflow-wrap-anywhere whitespace-break-spaces">
                              {children}
                            </blockquote>
                          ),
                          strong: ({ children }) => <strong className="font-bold text-gray-800 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</strong>,
                          em: ({ children }) => <em className="italic text-gray-600 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</em>,
                          a: ({ href, children }) => (
                            <a href={href} className="text-purple-600 hover:text-purple-800 underline break-words overflow-wrap-anywhere whitespace-break-spaces" target="_blank" rel="noopener noreferrer">
                              {children}
                            </a>
                          ),
                          table: ({ children }) => (
                            <div className="overflow-x-auto my-2">
                              <table className="min-w-full border border-gray-300 rounded-lg">{children}</table>
                            </div>
                          ),
                          thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
                          tbody: ({ children }) => <tbody>{children}</tbody>,
                          tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
                          th: ({ children }) => <th className="px-3 py-2 text-left font-semibold text-gray-800 border-r border-gray-300 last:border-r-0 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</th>,
                          td: ({ children }) => <td className="px-3 py-2 text-gray-700 border-r border-gray-300 last:border-r-0 break-words overflow-wrap-anywhere whitespace-break-spaces">{children}</td>,
                        }}
                      >
                        {message.content || '💭 AI正在思考中...'}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words overflow-wrap-anywhere whitespace-break-spaces">{message.content}</p>
                  )}
                  <div className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
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
              placeholder="输入你的消息... (Enter发送，Shift+Enter换行)"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none text-gray-800 placeholder-gray-500"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>发送中</span>
                </div>
              ) : (
                <span>发送 💘</span>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            支持Markdown语法 • 代码高亮
          </p>
        </div>
      </div>
    </div>
  );
}