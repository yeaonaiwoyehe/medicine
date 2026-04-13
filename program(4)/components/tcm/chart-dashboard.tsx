'use client';

import { useEffect, useRef, useState } from 'react';
import { type RecognitionResult } from '@/lib/mock-data';

// 声明 echarts 全局变量
declare global {
  interface Window {
    echarts: typeof import('echarts');
  }
}

interface ChartDashboardProps {
  result: RecognitionResult;
  onNodeClick: (artifactId: string) => void;
}

export function ChartDashboard({ result, onNodeClick }: ChartDashboardProps) {
  const graphRef = useRef<HTMLDivElement>(null);
  const pieRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const radarRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredTimeline, setHoveredTimeline] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 初始化所有图表
  useEffect(() => {
    if (typeof window === 'undefined' || !window.echarts) return;

    const echarts = window.echarts;
    const charts: ReturnType<typeof echarts.init>[] = [];
    const tcmPrimary = '#1a4d2e';
    const tcmPrimaryLight = '#2d6a4f';
    const tcmAccent = '#c9a87c';

    // 关系网络图
    if (graphRef.current) {
      const graphChart = echarts.init(graphRef.current);
      charts.push(graphChart);

      const nodes = [
        { 
          id: result.top1.id, 
          name: result.top1.name, 
          symbolSize: 60,
          category: 0,
          itemStyle: { color: tcmAccent }
        },
        { 
          id: result.top2.id, 
          name: result.top2.name, 
          symbolSize: 45,
          category: 1,
          itemStyle: { color: tcmPrimary }
        },
        { 
          id: result.top3.id, 
          name: result.top3.name, 
          symbolSize: 40,
          category: 1,
          itemStyle: { color: tcmPrimaryLight }
        },
        ...result.relatedArtifacts.slice(0, 3).map((a, i) => ({
          id: a.id,
          name: a.name,
          symbolSize: 30 - i * 3,
          category: 2,
          itemStyle: { color: '#95d5b2' }
        }))
      ];

      const links = [
        { source: result.top1.id, target: result.top2.id, value: result.top2.similarity },
        { source: result.top1.id, target: result.top3.id, value: result.top3.similarity },
        ...result.relatedArtifacts.slice(0, 3).map(a => ({
          source: result.top1.id,
          target: a.id,
          value: a.similarity
        }))
      ];

      graphChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: (params: { dataType: string; name: string; value?: number }) => {
            if (params.dataType === 'node') {
              return `<strong>${params.name}</strong>`;
            }
            return `相似度: ${params.value?.toFixed(1)}%`;
          }
        },
        series: [{
          type: 'graph',
          layout: 'force',
          animation: true,
          animationDuration: 1500,
          data: nodes,
          links: links.map(l => ({
            ...l,
            lineStyle: {
              width: l.value / 20,
              curveness: 0.2,
              color: tcmPrimaryLight
            }
          })),
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: 'bottom',
            fontSize: 11,
            color: '#333'
          },
          force: {
            repulsion: 200,
            edgeLength: [80, 150]
          },
          emphasis: {
            focus: 'adjacency',
            lineStyle: { width: 5 }
          }
        }]
      });

      graphChart.on('click', (params: { dataType: string; data?: { id: string } }) => {
        if (params.dataType === 'node' && params.data?.id) {
          onNodeClick(params.data.id);
        }
      });
    }

    // 朝代分布饼图
    if (pieRef.current) {
      const pieChart = echarts.init(pieRef.current);
      charts.push(pieChart);

      const totalCount = result.dynastyDistribution.reduce((sum, d) => sum + d.value, 0);

      pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        color: [tcmPrimary, tcmPrimaryLight, '#40916c', tcmAccent, '#95d5b2'],
        series: [{
          type: 'pie',
          radius: ['45%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          animationType: 'scale',
          animationDuration: 1500,
          label: {
            show: true,
            formatter: '{b}\n{d}%',
            fontSize: 11
          },
          labelLine: {
            length: 10,
            length2: 10
          },
          data: result.dynastyDistribution,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            }
          }
        }, {
          type: 'pie',
          radius: ['0%', '35%'],
          center: ['50%', '50%'],
          silent: true,
          label: {
            show: true,
            position: 'center',
            formatter: `{a|${totalCount}}\n{b|件文物}`,
            rich: {
              a: {
                fontSize: 28,
                fontWeight: 'bold',
                color: tcmPrimary
              },
              b: {
                fontSize: 12,
                color: '#666',
                padding: [5, 0, 0, 0]
              }
            }
          },
          data: [{ value: 1, itemStyle: { color: 'transparent' } }]
        }]
      });
    }

    // 相似度柱状图
    if (barRef.current) {
      const barChart = echarts.init(barRef.current);
      charts.push(barChart);

      barChart.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: '{b}: {c}%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: [result.top1.name, result.top2.name, result.top3.name],
          axisLabel: {
            interval: 0,
            fontSize: 10,
            rotate: 0,
            formatter: (value: string) => value.length > 6 ? value.slice(0, 6) + '...' : value
          }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [{
          type: 'bar',
          data: [
            {
              value: result.top1.similarity,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: tcmAccent },
                    { offset: 1, color: tcmPrimary }
                  ]
                }
              }
            },
            {
              value: result.top2.similarity,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: tcmPrimaryLight },
                    { offset: 1, color: tcmPrimary }
                  ]
                }
              }
            },
            {
              value: result.top3.similarity,
              itemStyle: {
                color: {
                  type: 'linear',
                  x: 0, y: 0, x2: 0, y2: 1,
                  colorStops: [
                    { offset: 0, color: '#40916c' },
                    { offset: 1, color: tcmPrimaryLight }
                  ]
                }
              }
            }
          ],
          barWidth: '50%',
          animationDuration: 1500,
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            fontSize: 12,
            fontWeight: 'bold',
            color: tcmPrimary
          }
        }]
      });
    }

    // 雷达图
    if (radarRef.current) {
      const radarChart = echarts.init(radarRef.current);
      charts.push(radarChart);

      const radarData = result.top1.radarData;

      radarChart.setOption({
        tooltip: {
          trigger: 'item'
        },
        radar: {
          indicator: [
            { name: '工艺价值', max: 100 },
            { name: '历史价值', max: 100 },
            { name: '药用关联', max: 100 },
            { name: '稀有度', max: 100 },
            { name: '文化影响', max: 100 }
          ],
          shape: 'polygon',
          splitNumber: 4,
          axisName: {
            color: '#333',
            fontSize: 11
          },
          splitLine: {
            lineStyle: {
              color: ['#e0e0e0']
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(26,77,46,0.02)', 'rgba(26,77,46,0.05)']
            }
          }
        },
        series: [{
          type: 'radar',
          data: [{
            value: [
              radarData.craftsmanship,
              radarData.historicalValue,
              radarData.medicinalRelevance,
              radarData.rarity,
              radarData.culturalInfluence
            ],
            name: result.top1.name,
            areaStyle: {
              color: {
                type: 'radial',
                x: 0.5, y: 0.5, r: 0.5,
                colorStops: [
                  { offset: 0, color: 'rgba(26,77,46,0.4)' },
                  { offset: 1, color: 'rgba(26,77,46,0.1)' }
                ]
              }
            },
            lineStyle: {
              color: tcmPrimary,
              width: 2
            },
            itemStyle: {
              color: tcmAccent
            }
          }],
          animationDuration: 1500
        }]
      });
    }

    // 响应窗口大小变化
    const handleResize = () => {
      charts.forEach(chart => chart.resize());
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      charts.forEach(chart => chart.dispose());
    };
  }, [result, onNodeClick]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            数据可视化
          </h2>
          <p className="text-muted-foreground">
            多维度分析与知识图谱展示
          </p>
        </div>

        {/* 图表网格 */}
        <div className={`grid md:grid-cols-2 gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* 关系网络图 */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <i className="fa-solid fa-diagram-project text-[var(--tcm-primary)]"></i>
              相似文物关系网络
            </h3>
            <p className="text-sm text-muted-foreground mb-4">点击节点可切换到该文物的识别结果</p>
            <div ref={graphRef} className="w-full h-80"></div>
          </div>

          {/* 朝代分布饼图 */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-[var(--tcm-primary)]"></i>
              朝代分布统计
            </h3>
            <div ref={pieRef} className="w-full h-80"></div>
          </div>

          {/* 相似度柱状图 */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-column text-[var(--tcm-primary)]"></i>
              Top3 相似度对比
            </h3>
            <div ref={barRef} className="w-full h-80"></div>
          </div>

          {/* 雷达图 */}
          <div className="bg-card rounded-2xl shadow-lg p-6">
            <h3 className="font-serif text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <i className="fa-solid fa-circle-radiation text-[var(--tcm-primary)]"></i>
              文物特征雷达图
            </h3>
            <div ref={radarRef} className="w-full h-80"></div>
          </div>
        </div>

        {/* 朝代演变时间轴 */}
        <div className={`mt-8 bg-card rounded-2xl shadow-lg p-6 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="font-serif text-lg font-bold text-foreground mb-6 flex items-center gap-2">
            <i className="fa-solid fa-timeline text-[var(--tcm-primary)]"></i>
            朝代演变时间轴
          </h3>
          
          <div className="relative">
            {/* 时间轴线 */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-border"></div>
            
            {/* 时间点 */}
            <div className="flex justify-between relative">
              {result.timeline.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center relative cursor-pointer group"
                  onMouseEnter={() => setHoveredTimeline(item.dynasty)}
                  onMouseLeave={() => setHoveredTimeline(null)}
                >
                  {/* 节点 */}
                  <div 
                    className={`w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all ${
                      item.isHighlighted 
                        ? 'bg-[var(--tcm-accent)] scale-110 shadow-lg' 
                        : 'bg-[var(--tcm-primary)] group-hover:scale-105'
                    }`}
                  >
                    <span className="text-white font-bold text-sm">{item.dynasty}</span>
                  </div>
                  
                  {/* 年份 */}
                  <p className="mt-3 text-xs text-muted-foreground whitespace-nowrap">{item.year}</p>
                  
                  {/* 悬浮提示 */}
                  {hoveredTimeline === item.dynasty && (
                    <div className="absolute bottom-full mb-2 px-3 py-2 bg-[var(--tcm-primary)] text-white text-sm rounded-lg shadow-lg whitespace-nowrap z-20">
                      <p className="font-medium">{item.dynasty}代</p>
                      <p className="text-white/80">收录 {item.count} 件文物</p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-[var(--tcm-primary)] rotate-45"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
