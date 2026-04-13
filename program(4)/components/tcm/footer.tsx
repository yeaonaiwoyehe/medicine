'use client';

export function Footer() {
  const techStack = [
    { name: 'React', icon: 'fa-react' },
    { name: 'Next.js', icon: 'fa-n' },
    { name: 'TypeScript', icon: 'fa-code' },
    { name: 'Tailwind', icon: 'fa-wind' },
    { name: 'ECharts', icon: 'fa-chart-line' },
  ];

  const links = [
    { name: '关于项目', href: '#about' },
    { name: '使用说明', href: '#demo' },
    { name: '技术文档', href: '#' },
    { name: '联系我们', href: '#' },
  ];

  return (
    <footer className="bg-[var(--tcm-primary)] text-white">
      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* 项目信息 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <i className="fa-solid fa-mortar-pestle text-[var(--tcm-accent)] text-xl"></i>
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold">器药同溯</h3>
                <p className="text-white/70 text-sm">中医药文物认知系统</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-4">
              基于人工智能的中医药文物智能识别与知识图谱系统，致力于传承和弘扬中华医药文化遗产。
            </p>
            <p className="text-[var(--tcm-accent)] font-serif text-lg italic">
              &ldquo;识器物 · 知本草 · 溯方剂&rdquo;
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-bold text-lg mb-4">快速链接</h4>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-white/80 hover:text-[var(--tcm-accent)] transition-colors flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs"></i>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 技术栈 */}
          <div>
            <h4 className="font-bold text-lg mb-4">技术栈</h4>
            <div className="flex flex-wrap gap-3">
              {techStack.map((tech) => (
                <div
                  key={tech.name}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <i className={`fa-brands ${tech.icon}`}></i>
                  <span className="text-sm">{tech.name}</span>
                </div>
              ))}
            </div>

            {/* 团队信息 */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <h5 className="font-medium mb-3">项目团队</h5>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--tcm-accent)] to-[var(--tcm-primary-light)] flex items-center justify-center text-xs font-bold border-2 border-[var(--tcm-primary)]"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-white/70 text-sm">研发团队</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部版权 */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center md:text-left">
              © 2024 器药同溯 - 中医药文物认知系统. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <i className="fa-brands fa-github text-xl"></i>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <i className="fa-brands fa-weixin text-xl"></i>
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors">
                <i className="fa-solid fa-envelope text-xl"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
