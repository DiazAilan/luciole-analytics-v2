import { useMemo, useState } from 'react';
import { Select } from '@design-system-rte/react';
import type { AnalyticsData } from '../types';
import { getCategoryColor } from '../constants/categories';
import { ChartCard } from './charts/ChartCard';
import { ChartLegend } from './charts/ChartLegend';
import styles from './ReleasePieChart.module.scss';

export function ReleasePieChart({ data }: { data: AnalyticsData }) {
  const [selectedRelease, setSelectedRelease] = useState<string | null>(null);

  const activeRelease = useMemo(() => {
    if (data.releaseStats.length === 0) return null;
    const fallback = data.releaseStats[data.releaseStats.length - 1].release;
    if (selectedRelease && data.releaseStats.some((r) => r.release === selectedRelease)) {
      return selectedRelease;
    }
    return fallback;
  }, [data.releaseStats, selectedRelease]);

  const releaseStat = data.releaseStats.find((r) => r.release === activeRelease);
  if (!releaseStat || !activeRelease) return null;

  const total = releaseStat.count;
  if (total === 0) return null;

  const categoryEntries = Object.entries(releaseStat.categories).sort(
    ([, a], [, b]) => b - a,
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

  const releaseOptions = data.releaseStats.map((r) => ({
    value: r.release,
    label: r.releaseLabel,
  }));

  return (
    <ChartCard
      title="Répartition par release"
      headerAction={
        <Select
          id="release-select"
          label="Release"
          value={activeRelease}
          options={releaseOptions}
          onChange={(value) => setSelectedRelease(value)}
          width={220}
        />
      }
    >
      <div className={styles.content}>
        <div
          className={styles.pie}
          style={{ background: `conic-gradient(${conicParts})` }}
          role="img"
          aria-label={`Répartition pour la release ${releaseStat.releaseLabel}`}
        />
        <ChartLegend
          items={segments.map((s) => ({
            name: s.name,
            color: s.color,
            percent: s.percent,
          }))}
        />
      </div>
    </ChartCard>
  );
}
