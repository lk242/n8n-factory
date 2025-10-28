import type { EChartsType } from 'echarts/core';

let echartsPromise: Promise<typeof import('echarts/core')> | null = null;

export async function loadECharts(): Promise<typeof import('echarts/core')> {
  if (!echartsPromise) {
    echartsPromise = (async () => {
      const echartsCore = await import('echarts/core');
      const charts = await import('echarts/charts');
      const components = await import('echarts/components');
      const renderers = await import('echarts/renderers');

      echartsCore.use([
        charts.BarChart,
        charts.LineChart,
        components.TitleComponent,
        components.TooltipComponent,
        components.LegendComponent,
        components.GridComponent,
        components.DatasetComponent,
        renderers.CanvasRenderer
      ]);

      return echartsCore;
    })();
  }
  return echartsPromise;
}

export type EChartsInstance = EChartsType;
