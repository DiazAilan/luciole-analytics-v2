import type { AnalyticsData } from '../types';
import { MAIN_CATEGORIES_ORDER } from '../constants/categories';
import styles from './ReleaseDistributionTable.module.scss';

const CATEGORY_COLORS = ['#4a90d9', '#e06c4a', '#2ecc71', '#9b59b6'];

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
  const releaseCount = data.releaseStats.length;
  const avgPerCategory = mainCategories.reduce(
    (acc, cat) => {
      acc[cat] = releaseCount > 0 ? (totals[cat] / releaseCount).toFixed(1) : '0';
      return acc;
    },
    {} as Record<string, string>
  );

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>
        Charge par release — Composant, Devops / Architecture, MCO et Documentation
      </h2>
      <div className={styles.legend}>
        {mainCategories.map((cat, i) => (
          <span key={cat} className={styles.legendItem}>
            <span className={styles.dot} style={{ background: CATEGORY_COLORS[i] }} />
            {cat}
          </span>
        ))}
      </div>
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
              const segments = mainCategories.map((cat, i) => {
                const val = (row[cat] as number) ?? 0;
                const pct = rowTotal > 0 ? (val / rowTotal) * 100 : 0;
                return { cat, val, pct, color: CATEGORY_COLORS[i] };
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
                    {mainCategories.map((cat, i) => {
                      const pct = totalGeneral > 0 ? (totals[cat] / totalGeneral) * 100 : 0;
                      return (
                        <div
                          key={cat}
                          className={styles.segment}
                          style={{ width: `${pct}%`, background: CATEGORY_COLORS[i] }}
                          title={`${cat}: ${totals[cat]}`}
                        />
                      );
                    })}
                  </div>
                  <div className={styles.percentages}>
                    {mainCategories.map((cat, i) => {
                      const pct = totalGeneral > 0 ? (totals[cat] / totalGeneral) * 100 : 0;
                      return (
                        <span key={cat} style={{ color: CATEGORY_COLORS[i] }}>
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
      <div className={styles.footer}>
        <span className={styles.footerLabel}>Moyenne par release</span>
        <div className={styles.avgGrid}>
          {mainCategories.map((cat) => (
            <div key={cat} className={styles.avgItem}>
              <span>{cat}</span>
              <strong>{avgPerCategory[cat]}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
