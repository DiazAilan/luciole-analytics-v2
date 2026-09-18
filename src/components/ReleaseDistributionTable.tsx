import type { AnalyticsData } from '../types';
import { MAIN_CATEGORIES_ORDER, getMainCategoryColor } from '../constants/categories';
import { ChartCard } from './charts/ChartCard';
import { ChartLegend } from './charts/ChartLegend';
import styles from './ReleaseDistributionTable.module.scss';

type RowData = { release: string; releaseLabel: string } & Record<string, number | string>;

export function ReleaseDistributionTable({ data }: { data: AnalyticsData }) {
  const mainCategories = MAIN_CATEGORIES_ORDER.filter((cat) =>
    data.categoryStats.some((c) => c.category === cat)
  );

  const releaseRows: RowData[] = data.releaseStats
    .slice()
    .reverse()
    .map((r) => ({
      release: r.release,
      releaseLabel: r.releaseLabel,
      ...r.categories,
    }));

  const totals = mainCategories.reduce(
    (acc, cat) => {
      acc[cat] = data.categoryStats.find((c) => c.category === cat)?.count ?? 0;
      return acc;
    },
    {} as Record<string, number>
  );

  const totalGeneral = Object.values(totals).reduce((a, b) => a + b, 0);

  const legendItems = mainCategories.map((cat) => ({
    name: cat,
    color: getMainCategoryColor(cat),
  }));

  return (
    <ChartCard title="Charge par release — Composant, Devops / Architecture, MCO et Documentation">
      <ChartLegend items={legendItems} layout="inline" />
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Release</th>
              <th>Distribution</th>
            </tr>
          </thead>
          <tbody>
            {releaseRows.map((row) => {
              const rowTotal = mainCategories.reduce(
                (s, c) => s + ((row[c] as number) ?? 0),
                0
              );
              const segments = mainCategories.map((cat) => {
                const val = (row[cat] as number) ?? 0;
                const pct = rowTotal > 0 ? (val / rowTotal) * 100 : 0;
                return { cat, val, pct, color: getMainCategoryColor(cat) };
              });
              return (
                <tr key={row.release}>
                  <td className={styles.releaseCell}>{row.releaseLabel}</td>
                  <td>
                    <div className={styles.barRow}>
                      <div className={styles.bar}>
                        {segments.map((s) => (
                          <div
                            key={s.cat}
                            className={styles.segment}
                            style={{ width: `${s.pct}%`, background: s.color }}
                            title={`${s.cat}: ${s.val}`}
                          />
                        ))}
                      </div>
                      <div className={styles.percentages}>
                        {segments.filter((s) => s.val > 0).map((s) => (
                          <span key={s.cat} style={{ color: s.color }}>
                            {s.pct.toFixed(0)}%
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className={styles.totalRow}>
              <td>Total général</td>
              <td>
                <div className={styles.barRow}>
                  <div className={styles.bar}>
                    {mainCategories.map((cat) => {
                      const pct = totalGeneral > 0 ? (totals[cat] / totalGeneral) * 100 : 0;
                      return (
                        <div
                          key={cat}
                          className={styles.segment}
                          style={{ width: `${pct}%`, background: getMainCategoryColor(cat) }}
                          title={`${cat}: ${totals[cat]}`}
                        />
                      );
                    })}
                  </div>
                  <div className={styles.percentages}>
                    {mainCategories.map((cat) => {
                      const pct = totalGeneral > 0 ? (totals[cat] / totalGeneral) * 100 : 0;
                      return (
                        <span key={cat} style={{ color: getMainCategoryColor(cat) }}>
                          {pct.toFixed(0)}%
                        </span>
                      );
                    })}
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
