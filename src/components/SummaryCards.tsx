import { Card, Grid } from '@design-system-rte/react';
import type { AnalyticsData } from '../types';
import styles from './SummaryCards.module.scss';

interface SummaryCardsProps {
  data: AnalyticsData;
}

function formatReleaseLabel(iso: string, releaseStats: AnalyticsData['releaseStats']): string {
  const match = releaseStats.find((r) => r.release === iso);
  return match?.releaseLabel ?? iso;
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <Card width="100%">
      <div className={styles.cardContent}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </Card>
  );
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const avgPerRelease =
    data.releaseStats.length > 0
      ? Math.round(data.totalTasks / data.releaseStats.length)
      : 0;

  const minLabel = formatReleaseLabel(data.releaseRange.min, data.releaseStats);
  const maxLabel = formatReleaseLabel(data.releaseRange.max, data.releaseStats);

  const stats = [
    { value: data.totalTasks, label: 'Tâches totales' },
    { value: data.releaseStats.length, label: 'Releases' },
    { value: avgPerRelease, label: 'Moy. par release' },
    { value: `${minLabel} – ${maxLabel}`, label: 'Période releases', size: {l: 3} },
  ];

  return (
    <Grid gridType="fluid">
      {stats.map((stat) => (
        <Grid.Col key={stat.label} xxs={12} xs={6} m={4} l={stat.size?.l ?? 3} className={styles.col}>
          <StatCard value={stat.value} label={stat.label} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
