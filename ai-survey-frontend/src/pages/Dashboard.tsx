import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import type { DashboardMetrics } from '../lib/types';
import ChartCard from '../components/ChartCard';

const DASHBOARD_QUERY_KEY = ['dashboard-metrics'];

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: DASHBOARD_QUERY_KEY,
    queryFn: () => get<DashboardMetrics>('/api/dashboard/metrics')
  });

  if (isLoading) {
    return <div className="loading">載入中...</div>;
  }

  if (error) {
    return <div className="error">取得儀表板資料時發生錯誤</div>;
  }

  if (!data) {
    return null;
  }

  const barOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: data.topTopics.map((item) => item.topic) },
    yAxis: { type: 'value' },
    series: [
      {
        type: 'bar',
        data: data.topTopics.map((item) => item.score),
        itemStyle: { color: '#3B82F6' }
      }
    ]
  };

  const trendOption = {
    tooltip: { trigger: 'axis' },
    legend: { data: ['完成率', '回覆數'] },
    xAxis: { type: 'category', data: data.trend.map((item) => item.date) },
    yAxis: [
      { type: 'value', name: '完成率(%)', min: 0, max: 100 },
      { type: 'value', name: '回覆數', min: 0, position: 'right' }
    ],
    series: [
      {
        name: '完成率',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        data: data.trend.map((item) => item.completionRate),
        itemStyle: { color: '#3B82F6' }
      },
      {
        name: '回覆數',
        type: 'bar',
        yAxisIndex: 1,
        data: data.trend.map((item) => item.responses),
        itemStyle: { color: '#60A5FA' }
      }
    ]
  };

  return (
    <div className="dashboard">
      <section className="metrics">
        <div className="metric-card">
          <p className="metric-label">回收率</p>
          <p className="metric-value">{data.recoveryRate.toFixed(1)}%</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">樣本數</p>
          <p className="metric-value">{data.sampleSize.toLocaleString()}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">情緒平均</p>
          <p className="metric-value">{data.sentimentAverage.toFixed(2)}</p>
        </div>
      </section>
      <section className="charts">
        <ChartCard title="主題排行" option={barOption} />
        <ChartCard title="近 7 天趨勢" option={trendOption} />
      </section>
    </div>
  );
}
