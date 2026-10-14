'use client';

import { useEffect, useState } from 'react';

interface HeroSectionProps {
  onUploadClick: () => void;
}

// 漂浮草药 SVG 组件
function FloatingHerb({ delay, duration, left, size }: { delay: number; duration: number; left: string; size: number }) {
  return (
    <div
      className="absolute opacity-20 dark:opacity-10 pointer-events-none"
      style={{
        left,
        top: `${Math.random() * 60 + 10}%`,
        animation: `float ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" fill="currentColor" className="text-[var(--tcm-primary)]">
        <path d="M50 10 C30 30, 20 50, 50 90 C80 50, 70 30, 50 10 M50 30 C40 40, 35 50, 50 70 C65 50, 60 40, 50 30" />
        <circle cx="25" cy="60" r="8" opacity="0.5" />
        <circle cx="75" cy="55" r="6" opacity="0.5" />
      </svg>
    </div>
  );
}

// 装饰性图案
function DecorativePattern({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none">
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" opacity="0.2" />
      <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1" opacity="0.15" />
      <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      <path d="M100 20 L100 180 M20 100 L180 100" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

export function HeroSection({ onUploadClick }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const herbs = [
    { delay: 0, duration: 6, left: '10%', size: 60 },
    { delay: 1, duration: 8, left: '25%', size: 40 },
    { delay: 2, duration: 7, left: '75%', size: 50 },
    { delay: 0.5, duration: 9, left: '85%', size: 45 },
    { delay: 1.5, duration: 6.5, left: '5%', size: 35 },
    { delay: 2.5, duration: 7.5, left: '90%', size: 55 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden paper-texture">
      {/* 渐变背景 */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary via-background to-background" />
      
      {/* 装饰性图案 */}
      <DecorativePattern className="absolute top-20 left-10 w-40 h-40 text-[var(--tcm-primary)] opacity-30" />
      <DecorativePattern className="absolute bottom-40 right-10 w-32 h-32 text-[var(--tcm-accent)] opacity-20" />
      
      {/* 漂浮草药 */}
      {herbs.map((herb, index) => (
        <FloatingHerb key={index} {...herb} />
      ))}

      {/* 主内容 */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* 大标题 */}
        <h1
          className={`font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-[var(--tcm-primary)] mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}
        >
          器药同溯
        </h1>

        {/* 副标题 */}
        <p
          className={`font-serif text-xl sm:text-2xl md:text-3xl text-muted-foreground mb-4 transition-all duration-1000 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          识器物 · 知本草 · 溯方剂
        </p>

        {/* 描述文字 */}
        <p
          className={`text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto mb-10 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          基于人工智能的中医药文物智能识别与知识图谱系统，探索千年医药文化的深厚底蕴
        </p>

        {/* 上传按钮 */}
        <button
          onClick={onUploadClick}
          className={`group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[var(--tcm-primary)] to-[var(--tcm-primary-light)] text-white font-medium text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 pulse-glow ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <i className="fa-solid fa-cloud-arrow-up text-xl group-hover:animate-bounce"></i>
          <span>上传文物图片</span>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
        </button>

        {/* 滚动提示 */}
        <div
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-sm">向下滚动探索</span>
            <i className="fa-solid fa-chevron-down animate-bounce"></i>
          </div>
        </div>
      </div>

      {/* 底部装饰渐变 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
