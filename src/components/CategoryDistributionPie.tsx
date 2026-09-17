import type { AnalyticsData } from '../types';
import { getCategoryColor } from '../constants/categories';
import styles from './CategoryDistributionPie.module.scss';

export function CategoryDistributionPie({ data }: { data: AnalyticsData }) {
  const total = data.totalTasks;
  if (total === 0) return null;

  const segments = data.categoryStats.slice(0, 6).map((stat, i) => ({
    name: stat.category,
    count: stat.count,
    percent: (stat.count / total) * 100,
    color: getCategoryColor(stat.category, i),
  }));

  const conicParts = segments
    .map((s, i) => {
      const prev = segments.slice(0, i).reduce((a, b) => a + b.percent, 0);
      return `${s.color} ${prev}% ${prev + s.percent}%`;
    })
    .join(', ');

  return (
    <section className={styles.card}>
      <h2 className={styles.title}>Répartition de la charge</h2>
      <div className={styles.content}>
        <div
          className={styles.pie}
          style={{ background: `conic-gradient(${conicParts})` }}
          role="img"
          aria-label="Répartition par catégorie"
        />
        <ul className={styles.legend}>
          {segments.map((s) => (
            <li key={s.name} className={styles.legendItem}>
              <span className={styles.dot} style={{ background: s.color }} />
              <span className={styles.name}>{s.name}</span>
              <span className={styles.percent}>{s.percent.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
