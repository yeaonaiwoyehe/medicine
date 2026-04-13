'use client';

import { useState, useEffect, useCallback } from 'react';
import { SAMPLE_ARTIFACTS } from '@/lib/mock-data';

interface ArtifactCarouselProps {
  onSampleClick: (sampleId: string) => void;
}

const ARTIFACT_DETAILS: Record<string, { description: string; dynasty: string; imageUrl: string }> = {
  'tang-mortar': {
    description: '唐代典型医药器具，用于研磨中药材，制备丸散膏丹。器身铸有缠枝莲纹，工艺精湛。',
    dynasty: '唐代 (618-907)',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
  },
  'song-jar': {
    description: '宋代龙泉窑青瓷精品，用于储存药材、药酒、药膏。釉色温润如玉，罐盖密合。',
    dynasty: '宋代 (960-1279)',
    imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop',
  },
  'ming-roller': {
    description: '明代医药器具精品，用于碾压矿物药和坚硬植物根茎。器身铸有"济世良药"四字。',
    dynasty: '明代 (1368-1644)',
    imageUrl: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=400&h=300&fit=crop',
  },
  'qing-acupuncture': {
    description: '清代太医院教学用具，仿照人体真实比例铸造，标注361个穴位，关节可活动。',
    dynasty: '清代 (1644-1912)',
    imageUrl: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?w=400&h=300&fit=crop',
  },
  'han-bamboo': {
    description: '汉代出土医学文献，记载50余个方剂，涉及内科、外科、妇科等多个领域。',
    dynasty: '汉代 (前202-220)',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
  },
  'ming-scale': {
    description: '明代药房必备之器，可称量钱、分、厘等极小单位，体现了对中药配方精确性的重视。',
    dynasty: '明代 (1368-1644)',
    imageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=300&fit=crop',
  },
};

function ArtifactCard({ 
  artifact, 
  isFlipped, 
  onClick,
  onFlip 
}: { 
  artifact: typeof SAMPLE_ARTIFACTS[0]; 
  isFlipped: boolean;
  onClick: () => void;
  onFlip: () => void;
}) {
  const details = ARTIFACT_DETAILS[artifact.id];

  return (
    <div 
      className="card-3d flex-shrink-0 w-64 h-80 cursor-pointer"
      onClick={onFlip}
    >
      <div className={`card-3d-inner ${isFlipped ? 'transform rotate-y-180' : ''}`} style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        {/* 正面 */}
        <div className="card-3d-front bg-card rounded-xl shadow-lg overflow-hidden border border-border">
          {/* 图片区域 */}
          <div className="relative h-48 bg-gradient-to-br from-secondary to-muted overflow-hidden">
            <img
              src={details.imageUrl}
              alt={artifact.name}
              className="w-full h-full object-cover opacity-90"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
            {/* 图标叠加 */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[var(--tcm-primary)]/20 to-transparent">
              <i className={`fa-solid ${artifact.icon} text-5xl text-[var(--tcm-primary)] opacity-80`}></i>
            </div>
            {/* 朝代标签 */}
            <div className="absolute top-3 right-3 px-3 py-1 bg-[var(--tcm-accent)] text-white text-xs font-medium rounded-full">
              {details.dynasty.split(' ')[0]}
            </div>
          </div>
          
          {/* 名称 */}
          <div className="p-4 text-center">
            <h3 className="font-serif text-lg font-bold text-foreground mb-2">{artifact.name}</h3>
            <p className="text-sm text-muted-foreground">点击查看详情</p>
          </div>
        </div>

        {/* 背面 */}
        <div className="card-3d-back bg-gradient-to-br from-[var(--tcm-primary)] to-[var(--tcm-primary-light)] rounded-xl shadow-lg p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <i className={`fa-solid ${artifact.icon} text-white text-xl`}></i>
            <h3 className="font-serif text-lg font-bold text-white">{artifact.name}</h3>
          </div>
          
          <p className="text-white/90 text-sm leading-relaxed flex-1">{details.description}</p>
          
          <div className="mt-4 pt-3 border-t border-white/20">
            <p className="text-white/70 text-xs mb-3">{details.dynasty}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
              className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <i className="fa-solid fa-search mr-2"></i>
              识别此文物
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ArtifactCarousel({ onSampleClick }: ArtifactCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isPaused, setIsPaused] = useState(false);

  // 自动轮播
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SAMPLE_ARTIFACTS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + SAMPLE_ARTIFACTS.length) % SAMPLE_ARTIFACTS.length);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SAMPLE_ARTIFACTS.length);
  }, []);

  const handleFlip = useCallback((index: number) => {
    setFlippedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  return (
    <section className="py-16 md:py-24 bg-secondary/50" id="demo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            示例文物
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            点击卡片翻转查看详情，或直接点击识别按钮体验智能识别功能
          </p>
        </div>

        {/* 轮播区域 */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* 左箭头 */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card shadow-lg rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="上一个"
          >
            <i className="fa-solid fa-chevron-left text-foreground"></i>
          </button>

          {/* 卡片容器 */}
          <div className="overflow-hidden mx-14">
            <div 
              className="flex gap-6 transition-transform duration-500 ease-out py-4"
              style={{ 
                transform: `translateX(calc(-${currentIndex * 280}px + 50% - 140px))` 
              }}
            >
              {SAMPLE_ARTIFACTS.map((artifact, index) => (
                <ArtifactCard
                  key={artifact.id}
                  artifact={artifact}
                  isFlipped={flippedCards.has(index)}
                  onClick={() => onSampleClick(artifact.id)}
                  onFlip={() => handleFlip(index)}
                />
              ))}
            </div>
          </div>

          {/* 右箭头 */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-card shadow-lg rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
            aria-label="下一个"
          >
            <i className="fa-solid fa-chevron-right text-foreground"></i>
          </button>
        </div>

        {/* 圆点指示器 */}
        <div className="flex justify-center gap-2 mt-8">
          {SAMPLE_ARTIFACTS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-[var(--tcm-primary)] w-8'
                  : 'bg-border hover:bg-muted-foreground'
              }`}
              aria-label={`跳转到第 ${index + 1} 个`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
