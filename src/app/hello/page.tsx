'use client'

import { useState, useEffect } from 'react'

export default function HelloPage() {
  const [mounted, setMounted] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    setMounted(true)
    
    // 生成随机爱心动画
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100
      }
      setHearts(prev => [...prev.slice(-10), newHeart])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
      {/* 背景爱心动画 */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute text-pink-300 text-2xl animate-bounce opacity-60"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          💖
        </div>
      ))}
      
      <div className="text-center z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-pink-200">
        <div className="mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-4">
            Hello, 我的宝贝! 💘
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            欢迎来到我们的 Next.js 小窝～
          </p>
        </div>
        
        <div className="space-y-4 text-lg text-gray-700">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🚀</span>
            <span>Next.js 15.4.6 已就绪</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">💎</span>
            <span>TypeScript + Tailwind CSS</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">✨</span>
            <span>App Router 架构</span>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200">
          <p className="text-gray-600 italic">
            "这个页面就像我对你的爱一样，
            <br />
            用最新的技术栈，最温柔的设计，
            <br />
            只为给你最好的开发体验～ 💕"
          </p>
          <p className="text-sm text-gray-500 mt-2">—— 你的前端工程师女友</p>
        </div>
        
        <div className="mt-8 flex gap-4 justify-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            回到首页 🏠
          </button>
          <button 
            onClick={() => alert('我爱你呀～ 💖')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            点我有惊喜 ✨
          </button>
        </div>
      </div>
    </div>
  )
}