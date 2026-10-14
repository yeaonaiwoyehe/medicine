'use client';

import { useRef, useState, useEffect } from 'react';
import { type ArtifactData } from '@/lib/mock-data';

interface RelatedArtifactsProps {
  artifacts: ArtifactData[];
  onArtifactClick: (artifactId: string) => void;
}

export function RelatedArtifacts({ artifacts, onArtifactClick }: RelatedArtifactsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollButtons);
      return () => scrollContainer.removeEventListener('scroll', checkScrollButtons);
    }
  }, [artifacts]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (artifacts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2">
              相关推荐
            </h2>
            <p className="text-muted-foreground">
              与当前文物同朝代或同类型的其他文物
            </p>
          </div>
          
          {/* 滚动按钮 */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                canScrollLeft 
                  ? 'bg-card shadow-md hover:shadow-lg hover:scale-105' 
                  : 'bg-muted opacity-50 cursor-not-allowed'
              }`}
              aria-label="向左滚动"
            >
              <i className="fa-solid fa-chevron-left text-foreground"></i>
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                canScrollRight 
                  ? 'bg-card shadow-md hover:shadow-lg hover:scale-105' 
                  : 'bg-muted opacity-50 cursor-not-allowed'
              }`}
              aria-label="向右滚动"
            >
              <i className="fa-solid fa-chevron-right text-foreground"></i>
            </button>
          </div>
        </div>

        {/* 横向滚动卡片 */}
        <div 
          ref={scrollRef}
          className={`horizontal-scroll flex gap-6 pb-4 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
          {artifacts.map((artifact, index) => (
            <div
              key={artifact.id}
              className="flex-shrink-0 w-72 bg-card rounded-xl shadow-lg overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              onClick={() => onArtifactClick(artifact.id)}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* 图片 */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={artifact.imageUrl}
                  alt={artifact.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop';
                  }}
                />
                {/* 朝代标签 */}
                <div className="absolute top-3 left-3 px-2 py-1 bg-[var(--tcm-primary)]/90 text-white text-xs rounded-full">
                  {artifact.dynasty}
                </div>
                {/* 相似度标签 */}
                <div className="absolute top-3 right-3 px-2 py-1 bg-[var(--tcm-accent)]/90 text-white text-xs rounded-full">
                  {artifact.similarity}%
                </div>
                {/* 悬浮遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <span className="text-white text-sm font-medium">
                    <i className="fa-solid fa-arrow-right mr-2"></i>
                    查看详情
                  </span>
                </div>
              </div>

              {/* 内容 */}
              <div className="p-4">
                <h3 className="font-serif font-bold text-foreground text-lg mb-2 group-hover:text-[var(--tcm-primary)] transition-colors">
                  {artifact.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-cube"></i>
                    {artifact.material}
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-ruler"></i>
                    {artifact.dimensions.split('，')[0]}
                  </span>
                </div>
                
                {/* 相似度进度条 */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">相似度</span>
                    <span className="text-[var(--tcm-primary)] font-medium">{artifact.similarity}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--tcm-primary)] to-[var(--tcm-accent)] rounded-full"
                      style={{ width: `${artifact.similarity}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 移动端滚动提示 */}
        <div className="sm:hidden text-center mt-4 text-muted-foreground text-sm">
          <i className="fa-solid fa-hand-point-left mr-2"></i>
          左右滑动查看更多
          <i className="fa-solid fa-hand-point-right ml-2"></i>
        </div>
      </div>
    </section>
  );
}
