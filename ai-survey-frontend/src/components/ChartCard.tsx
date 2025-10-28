import { useEffect, useRef } from 'react';
import type { EChartsOption } from 'echarts';
import { loadECharts } from '../lib/echarts';

interface ChartCardProps {
  title: string;
  option: EChartsOption;
}

export default function ChartCard({ title, option }: ChartCardProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let chartInstance: import('echarts').ECharts | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;

    loadECharts().then((echarts) => {
      if (!chartRef.current || disposed) return;
      chartInstance = echarts.init(chartRef.current);
      chartInstance.setOption(option);
      resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
      });
      resizeObserver.observe(chartRef.current);
    });

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      chartInstance?.dispose();
    };
  }, [option]);

  return (
    <div className="card">
      <div className="card-header">
        <h3>{title}</h3>
      </div>
      <div className="card-content">
        <div ref={chartRef} className="chart" />
      </div>
    </div>
  );
}
