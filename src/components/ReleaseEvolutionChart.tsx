import type { AnalyticsData } from '../types';
import { MAIN_CATEGORIES_ORDER } from '../constants/categories';
import styles from './ReleaseEvolutionChart.module.scss';

const CATEGORY_COLORS = ['#4a90d9', '#e06c4a', '#2ecc71', '#9b59b6'];

export function ReleaseEvolutionChart({ data }: { data: AnalyticsData }) {
  const mainCategories = MAIN_CATEGORIES_ORDER.filter((cat) =>
    data.categoryStats.some((c) => c.category === cat)
  );

  const releaseStats = data.releaseStats;
  if (releaseStats.length === 0) return null;

  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 800;
  const height = 280;
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

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Évolution par release</h2>
      <p className={styles.subtitle}>
        Composant, Devops / Architecture, MCO et Documentation
      </p>
      <div className={styles.legend}>
        {mainCategories.map((cat, i) => (
          <span key={cat} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: CATEGORY_COLORS[i] }} />
            {cat}
          </span>
        ))}
      </div>
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
            {releaseStats.map((r, i) => (
              <text
                key={r.release}
                x={(i / Math.max(releaseStats.length - 1, 1)) * chartWidth}
                y={chartHeight + 24}
                className={styles.axisLabel}
                textAnchor="middle"
              >
                {r.releaseLabel}
              </text>
            ))}
            {mainCategories.map((cat, i) => (
              <path
                key={cat}
                d={linePath((r) => r.categories[cat] ?? 0)}
                fill="none"
                stroke={CATEGORY_COLORS[i]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.line}
              />
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
