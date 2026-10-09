import { Tooltip } from '@design-system-rte/react';
import type { AnalyticsData } from '../types';
import { MAIN_CATEGORIES_ORDER, getMainCategoryColor } from '../constants/categories';
import { ChartCard } from './charts/ChartCard';
import { ChartLegend } from './charts/ChartLegend';
import styles from './ReleaseEvolutionChart.module.scss';

function formatAxisDate(releaseLabel: string, releaseIso: string): string {
  const labelMatch = releaseLabel.match(/^(\d{2}-\d{2})-\d{4}$/);
  if (labelMatch) return labelMatch[1];

  const isoMatch = releaseIso.match(/^\d{4}-(\d{2})-(\d{2})$/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}`;

  return releaseLabel;
}

export function ReleaseEvolutionChart({ data }: { data: AnalyticsData }) {
  const mainCategories = MAIN_CATEGORIES_ORDER.filter((cat) =>
    data.categoryStats.some((c) => c.category === cat)
  );

  const releaseStats = data.releaseStats;
  if (releaseStats.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 12, left: 40 };
  const width = 800;
  const height = 260;
  const xAxisPaddingLeft = `${(padding.left / width) * 100}%`;
  const xAxisPaddingRight = `${(padding.right / width) * 100}%`;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVal = Math.max(
    ...releaseStats.flatMap((r) =>
      mainCategories.map((c) => r.categories[c] ?? 0)
    ),
    1
  );
  const yMax = Math.ceil(maxVal / 5) * 5 || 5;

  const yScale = (val: number) => chartHeight - (val / yMax) * chartHeight;

  const linePath = (getVal: (r: (typeof releaseStats)[0]) => number) => {
    const points = releaseStats.map((r, i) => {
      const x = (i / Math.max(releaseStats.length - 1, 1)) * chartWidth;
      const y = yScale(getVal(r));
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  };

  const yTicks = Array.from({ length: Math.floor(yMax / 5) + 1 }, (_, i) => i * 5);

  const legendItems = mainCategories.map((cat) => ({
    name: cat,
    color: getMainCategoryColor(cat),
  }));

  return (
    <ChartCard
      title="Évolution par release"
      subtitle={MAIN_CATEGORIES_ORDER.join(', ')}
    >
      <ChartLegend items={legendItems} layout="inline" />
      <div className={styles.chartWrapper}>
        <svg viewBox={`0 0 ${width} ${height}`} className={styles.chart} role="img" aria-label="Évolution par release">
          <g transform={`translate(${padding.left}, ${padding.top})`}>
            {yTicks.map((n) => (
              <g key={n}>
                <line
                  x1={0}
                  y1={yScale(n)}
                  x2={chartWidth}
                  y2={yScale(n)}
                  className={styles.gridLine}
                />
                <text x={-8} y={yScale(n) + 4} className={styles.axisLabel} textAnchor="end">
                  {n}
                </text>
              </g>
            ))}
            {mainCategories.map((cat) => (
              <path
                key={cat}
                d={linePath((r) => r.categories[cat] ?? 0)}
                fill="none"
                stroke={getMainCategoryColor(cat)}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.line}
              />
            ))}
          </g>
        </svg>
        <div
          className={`${styles.xAxis} ${releaseStats.length === 1 ? styles.xAxisSingle : ''}`}
          style={{
            paddingLeft: xAxisPaddingLeft,
            paddingRight: xAxisPaddingRight,
          }}
        >
          {releaseStats.map((r) => (
            <Tooltip key={r.release} label={r.releaseLabel} position="bottom">
              <span className={styles.axisTickLabel}>
                {formatAxisDate(r.releaseLabel, r.release)}
              </span>
            </Tooltip>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
