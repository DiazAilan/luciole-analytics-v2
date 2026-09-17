import { useEffect, useState } from 'react';
import type { AnalyticsData } from '../types';
import { getCategoryColor } from '../constants/categories';
import styles from './ReleasePieChart.module.scss';

export function ReleasePieChart({ data }: { data: AnalyticsData }) {
  const lastRelease =
    data.releaseStats.length > 0
      ? data.releaseStats[data.releaseStats.length - 1].release
      : null;

  const [selectedRelease, setSelectedRelease] = useState<string | null>(lastRelease);

  useEffect(() => {
    if (lastRelease === null) return;
    const exists = data.releaseStats.some((r) => r.release === selectedRelease);
    if (!exists) setSelectedRelease(lastRelease);
  }, [data.releaseStats, lastRelease, selectedRelease]);

  const releaseStat = data.releaseStats.find((r) => r.release === selectedRelease);
  if (!releaseStat || !selectedRelease) return null;

  const total = releaseStat.count;
  if (total === 0) return null;

  const categoryEntries = Object.entries(releaseStat.categories).sort(
    ([, a], [, b]) => b - a
  );

  const segments = categoryEntries.map(([name, count], i) => ({
    name,
    count,
    percent: (count / total) * 100,
    color: getCategoryColor(name, i),
  }));

  const conicParts = segments
    .map((s, i) => {
      const prev = segments.slice(0, i).reduce((a, b) => a + b.percent, 0);
      return `${s.color} ${prev}% ${prev + s.percent}%`;
    })
    .join(', ');

  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Répartition par release</h2>
        <select
          className={styles.select}
          value={selectedRelease}
          onChange={(e) => setSelectedRelease(e.target.value)}
          aria-label="Release"
        >
          {data.releaseStats.map((r) => (
            <option key={r.release} value={r.release}>
              {r.releaseLabel}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.content}>
        <div
          className={styles.pie}
          style={{ background: `conic-gradient(${conicParts})` }}
          role="img"
          aria-label={`Répartition pour la release ${releaseStat.releaseLabel}`}
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
