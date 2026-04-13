'use client';

import { useState, useEffect } from 'react';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function Navbar({ isDarkMode, onToggleDarkMode }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-card/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo 和项目名称 */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--tcm-primary)] to-[var(--tcm-primary-light)] flex items-center justify-center shadow-md">
              <i className="fa-solid fa-mortar-pestle text-white text-lg"></i>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold text-foreground">
                器药同溯
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                中医药文物认知系统
              </span>
            </div>
          </div>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#"
              className="text-foreground hover:text-[var(--tcm-primary)] transition-colors font-medium"
            >
              <i className="fa-solid fa-home mr-2"></i>首页
            </a>
            <a
              href="#about"
              className="text-foreground hover:text-[var(--tcm-primary)] transition-colors font-medium"
            >
              <i className="fa-solid fa-info-circle mr-2"></i>关于
            </a>
            <a
              href="#demo"
              className="text-foreground hover:text-[var(--tcm-primary)] transition-colors font-medium"
            >
              <i className="fa-solid fa-play-circle mr-2"></i>演示
            </a>
          </div>

          {/* 深色模式切换和移动端菜单按钮 */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleDarkMode}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all hover:scale-105"
              aria-label="切换深色模式"
            >
              {isDarkMode ? (
                <i className="fa-solid fa-sun text-[var(--tcm-accent)]"></i>
              ) : (
                <i className="fa-solid fa-moon text-[var(--tcm-primary)]"></i>
              )}
            </button>

            {/* 移动端菜单按钮 */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-all"
              aria-label="菜单"
            >
              <i className={`fa-solid ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-foreground`}></i>
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a
                href="#"
                className="text-foreground hover:text-[var(--tcm-primary)] transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-home mr-2"></i>首页
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-[var(--tcm-primary)] transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-info-circle mr-2"></i>关于
              </a>
              <a
                href="#demo"
                className="text-foreground hover:text-[var(--tcm-primary)] transition-colors font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <i className="fa-solid fa-play-circle mr-2"></i>演示
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
