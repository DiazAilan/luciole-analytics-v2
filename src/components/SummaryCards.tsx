import type { AnalyticsData } from '../types';
import styles from './SummaryCards.module.scss';

interface SummaryCardsProps {
  data: AnalyticsData;
}

function formatReleaseLabel(iso: string, releaseStats: AnalyticsData['releaseStats']): string {
  const match = releaseStats.find((r) => r.release === iso);
  return match?.releaseLabel ?? iso;
}

export function SummaryCards({ data }: SummaryCardsProps) {
  const avgPerRelease =
    data.releaseStats.length > 0
      ? Math.round(data.totalTasks / data.releaseStats.length)
      : 0;

  const minLabel = formatReleaseLabel(data.releaseRange.min, data.releaseStats);
  const maxLabel = formatReleaseLabel(data.releaseRange.max, data.releaseStats);

  return (
    <div className={styles.cards}>
      <div className={styles.card}>
        <span className={styles.value}>{data.totalTasks}</span>
        <span className={styles.label}>Tâches totales</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{data.releaseStats.length}</span>
        <span className={styles.label}>Releases</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{data.categoryStats.length}</span>
        <span className={styles.label}>Catégories</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{avgPerRelease}</span>
        <span className={styles.label}>Moy. par release</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{minLabel} – {maxLabel}</span>
        <span className={styles.label}>Période releases</span>
      </div>
    </div>
  );
}
