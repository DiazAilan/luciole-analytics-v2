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
  const minLabel = formatReleaseLabel(data.releaseRange.min, data.releaseStats);
  const maxLabel = formatReleaseLabel(data.releaseRange.max, data.releaseStats);

  const stats = [
    { value: data.totalTasks, label: 'Tâches totales', l: 3 },
    { value: data.userAnomalyTasks, label: 'Tickets anomalie users', l: 3 },
    { value: data.releaseStats.length, label: 'Releases', l: 3 },
    { value: `${minLabel} – ${maxLabel}`, label: 'Période releases', l: 3 },
  ];

  return (
    <Grid gridType="fluid">
      {stats.map((stat) => (
        <Grid.Col key={stat.label} xxs={12} xs={6} m={4} l={stat.l} className={styles.col}>
          <StatCard value={stat.value} label={stat.label} />
        </Grid.Col>
      ))}
    </Grid>
  );
}
