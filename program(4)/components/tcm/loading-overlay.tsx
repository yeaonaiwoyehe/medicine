'use client';

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        {/* 药碾滚动动画 SVG */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* 碾槽 */}
          <svg viewBox="0 0 120 60" className="w-full absolute bottom-0">
            <path
              d="M10 30 Q60 60, 110 30 Q110 50, 60 55 Q10 50, 10 30"
              fill="var(--tcm-primary)"
              opacity="0.3"
            />
            <path
              d="M15 28 Q60 52, 105 28"
              stroke="var(--tcm-primary)"
              strokeWidth="3"
              fill="none"
            />
          </svg>
          
          {/* 碾轮 */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--tcm-primary)] to-[var(--tcm-primary-light)] shadow-lg roller-spin">
            <div className="absolute inset-2 rounded-full border-2 border-white/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/50"></div>
            </div>
            {/* 辐条 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0.5 h-12 bg-white/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center rotate-45">
              <div className="w-0.5 h-12 bg-white/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center rotate-90">
              <div className="w-0.5 h-12 bg-white/20"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center rotate-135">
              <div className="w-0.5 h-12 bg-white/20"></div>
            </div>
          </div>

          {/* 药粉粒子 */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[var(--tcm-accent)]"
                style={{
                  animation: `bounce 0.6s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* 加载文字 */}
        <div className="space-y-3">
          <h3 className="font-serif text-xl font-bold text-foreground">
            辨形识药中...
          </h3>
          <p className="text-muted-foreground text-sm">
            正在分析文物特征，匹配知识图谱
          </p>
          
          {/* 进度点 */}
          <div className="flex justify-center gap-2 pt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-[var(--tcm-primary)]"
                style={{
                  animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
