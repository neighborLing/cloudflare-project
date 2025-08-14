'use client';

import { useState } from 'react';

export default function GraphQLTestPage() {
  const [query, setQuery] = useState('{ health }');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const executeQuery = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`错误: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🚀 GraphQL API 测试
          </h1>
          <p className="text-xl text-gray-600">
            测试你的GraphQL API是否正常工作～ 💘
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📝 GraphQL 查询</h2>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="输入你的GraphQL查询..."
          />
          <button
            onClick={executeQuery}
            disabled={loading}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors duration-200"
          >
            {loading ? '执行中...' : '🚀 执行查询'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 查询结果</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm font-mono whitespace-pre-wrap">
            {result || '点击上面的按钮执行查询～'}
          </pre>
        </div>

        <div className="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">💡 示例查询</h3>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-700">健康检查:</h4>
              <code className="bg-white px-2 py-1 rounded text-sm">{`{ health }`}</code>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">获取聊天历史:</h4>
              <code className="bg-white px-2 py-1 rounded text-sm">{`{ getChatHistory { id role content timestamp } }`}</code>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700">发送消息:</h4>
              <code className="bg-white px-2 py-1 rounded text-sm">
                {`mutation { sendChatMessage(input: {message: "Hello!"}) { success message { content } } }`}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}