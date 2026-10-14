'use client';

import { useState, useEffect, useCallback } from 'react';
import { type RecognitionResult } from '@/lib/mock-data';

interface ResultSectionProps {
  result: RecognitionResult;
  imageUrl: string | null;
}

// 数字滚动动画 Hook
function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // 使用 easeOutQuad 缓动函数
      const easeProgress = 1 - (1 - progress) * (1 - progress);
      setCount(Math.floor(startValue + (end - startValue) * easeProgress * 10) / 10);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

// 相似度条组件
function SimilarityBar({ name, similarity, rank, delay }: { name: string; similarity: number; rank: number; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const animatedSimilarity = useCountUp(isVisible ? similarity : 0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const rankColors = ['bg-[var(--tcm-accent)]', 'bg-[var(--tcm-primary)]', 'bg-[var(--tcm-primary-light)]'];

  return (
    <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full ${rankColors[rank - 1]} text-white text-xs flex items-center justify-center font-bold`}>
            {rank}
          </span>
          <span className="text-sm font-medium text-foreground">{name}</span>
        </div>
        <span className="text-sm font-bold text-[var(--tcm-primary)]">{animatedSimilarity.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${rankColors[rank - 1]} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: isVisible ? `${similarity}%` : '0%' }}
        />
      </div>
    </div>
  );
}

// Tab 内容组件
function TabContent({ result, activeTab, onReadStory }: { result: RecognitionResult; activeTab: string; onReadStory: () => void }) {
  const artifact = result.top1;

  switch (activeTab) {
    case 'archive':
      return (
        <div className="space-y-4 slide-in-right" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                <i className="fa-solid fa-calendar-alt mr-2"></i>朝代
              </p>
              <p className="font-medium text-foreground">{artifact.dynasty}</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                <i className="fa-solid fa-clock mr-2"></i>年代
              </p>
              <p className="font-medium text-foreground">{artifact.period}</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                <i className="fa-solid fa-cube mr-2"></i>材质
              </p>
              <p className="font-medium text-foreground">{artifact.material}</p>
            </div>
            <div className="p-4 bg-secondary/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                <i className="fa-solid fa-ruler mr-2"></i>尺寸
              </p>
              <p className="font-medium text-foreground text-sm">{artifact.dimensions}</p>
            </div>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <i className="fa-solid fa-scroll mr-2"></i>用途
            </p>
            <p className="font-medium text-foreground">{artifact.usage}</p>
          </div>
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <i className="fa-solid fa-book-open mr-2"></i>描述
            </p>
            <p className="text-foreground leading-relaxed">{artifact.description}</p>
          </div>
        </div>
      );

    case 'herbs':
      return (
        <div className="space-y-4 slide-in-right" style={{ animationDelay: '0.1s' }}>
          <p className="text-muted-foreground mb-4">
            与此文物相关的常用药材及其功效
          </p>
          <div className="grid gap-4">
            {artifact.herbs.map((herb, index) => (
              <div key={index} className="p-4 bg-secondary/50 rounded-lg flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--tcm-primary)]/10 flex items-center justify-center flex-shrink-0">
                  <i className="fa-solid fa-leaf text-[var(--tcm-primary)] text-xl"></i>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-foreground text-lg">{herb}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{artifact.herbDescriptions[index]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'prescription':
      return (
        <div className="space-y-4 slide-in-right" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 bg-gradient-to-br from-[var(--tcm-primary)]/10 to-secondary/50 rounded-xl border border-[var(--tcm-primary)]/20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
                <i className="fa-solid fa-prescription text-[var(--tcm-accent)]"></i>
                {artifact.prescription.name}
              </h3>
              <button
                onClick={onReadStory}
                className="px-4 py-2 bg-[var(--tcm-accent)] hover:bg-[var(--tcm-accent-dark)] text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-volume-high"></i>
                朗读故事
              </button>
            </div>
            <p className="text-foreground leading-relaxed mb-4">{artifact.prescription.story}</p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <i className="fa-solid fa-list-ul text-[var(--tcm-primary)]"></i>
              方剂组成
            </h4>
            <div className="flex flex-wrap gap-2">
              {artifact.prescription.ingredients.map((ing, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-[var(--tcm-primary)]/10 text-[var(--tcm-primary)] rounded-full text-sm"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <i className="fa-solid fa-heart-pulse text-[var(--tcm-primary)]"></i>
              功效
            </h4>
            <p className="text-foreground">{artifact.prescription.effect}</p>
          </div>
        </div>
      );

    case 'modern':
      return (
        <div className="space-y-4 slide-in-right" style={{ animationDelay: '0.1s' }}>
          <div className="p-5 bg-gradient-to-br from-[var(--tcm-accent)]/10 to-secondary/50 rounded-xl border border-[var(--tcm-accent)]/20">
            <h3 className="font-serif text-xl font-bold text-foreground mb-3 flex items-center gap-2">
              <i className="fa-solid fa-flask text-[var(--tcm-accent)]"></i>
              {artifact.modernApplication.title}
            </h3>
            <p className="text-foreground leading-relaxed">
              {artifact.modernApplication.description}
            </p>
          </div>

          <div className="p-4 bg-secondary/50 rounded-lg">
            <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
              <i className="fa-solid fa-microscope text-[var(--tcm-primary)]"></i>
              应用实例
            </h4>
            <ul className="space-y-2">
              {artifact.modernApplication.examples.map((example, index) => (
                <li key={index} className="flex items-start gap-2 text-foreground">
                  <i className="fa-solid fa-check-circle text-[var(--tcm-primary)] mt-1"></i>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function ResultSection({ result, imageUrl }: ResultSectionProps) {
  const [activeTab, setActiveTab] = useState('archive');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 朗读故事功能
  const handleReadStory = useCallback(() => {
    if ('speechSynthesis' in window) {
      // 停止之前的朗读
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(result.top1.prescription.story);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [result.top1.prescription.story]);

  const tabs = [
    { id: 'archive', name: '器物档案', icon: 'fa-archive' },
    { id: 'herbs', name: '药材配伍', icon: 'fa-leaf' },
    { id: 'prescription', name: '方剂故事', icon: 'fa-book' },
    { id: 'modern', name: '现代应用', icon: 'fa-flask' },
  ];

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            识别结果
          </h2>
          <p className="text-muted-foreground">
            基于深度学习的文物特征分析
          </p>
        </div>

        {/* 主内容区 */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* 左侧：图片预览和相似度 */}
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            {/* 图片预览 */}
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="relative aspect-[4/3]">
                <img
                  src={imageUrl || result.top1.imageUrl}
                  alt={result.top1.name}
                  className="w-full h-full object-cover"
                />
                {/* 识别标签 */}
                <div className="absolute top-4 left-4 px-4 py-2 bg-[var(--tcm-primary)] text-white rounded-full text-sm font-medium shadow-lg">
                  <i className="fa-solid fa-check-circle mr-2"></i>
                  已识别
                </div>
                {/* 文物名称 */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="font-serif text-2xl font-bold text-white">{result.top1.name}</h3>
                  <p className="text-white/80">{result.top1.dynasty} · {result.top1.material}</p>
                </div>
              </div>
            </div>

            {/* 相似度排名 */}
            <div className="bg-card rounded-2xl shadow-lg p-6">
              <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <i className="fa-solid fa-chart-bar text-[var(--tcm-primary)]"></i>
                相似度排名
              </h3>
              <div className="space-y-4">
                <SimilarityBar name={result.top1.name} similarity={result.top1.similarity} rank={1} delay={200} />
                <SimilarityBar name={result.top2.name} similarity={result.top2.similarity} rank={2} delay={400} />
                <SimilarityBar name={result.top3.name} similarity={result.top3.similarity} rank={3} delay={600} />
              </div>
            </div>
          </div>

          {/* 右侧：详细信息 Tabs */}
          <div className={`transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            <div className="bg-card rounded-2xl shadow-lg overflow-hidden">
              {/* Tab 导航 */}
              <div className="flex border-b border-border overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'text-[var(--tcm-primary)] border-b-2 border-[var(--tcm-primary)] bg-secondary/50'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                    }`}
                  >
                    <i className={`fa-solid ${tab.icon} mr-2`}></i>
                    <span className="hidden sm:inline">{tab.name}</span>
                  </button>
                ))}
              </div>

              {/* Tab 内容 */}
              <div className="p-6 min-h-[400px]">
                <TabContent result={result} activeTab={activeTab} onReadStory={handleReadStory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
