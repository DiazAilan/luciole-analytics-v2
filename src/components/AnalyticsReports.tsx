import type { AnalyticsData } from '../types';
import { SummaryCards } from './SummaryCards';
import { CategoryDistributionPie } from './CategoryDistributionPie';
import { ReleasePieChart } from './ReleasePieChart';
import { ReleaseEvolutionChart } from './ReleaseEvolutionChart';
import { ReleaseDistributionTable } from './ReleaseDistributionTable';
import styles from './AnalyticsReports.module.scss';

interface AnalyticsReportsProps {
  data: AnalyticsData;
}

export function AnalyticsReports({ data }: AnalyticsReportsProps) {
  return (
    <div className={styles.reports}>
      <SummaryCards data={data} />
      <div className={styles.pieRow}>
        <CategoryDistributionPie data={data} />
        <ReleasePieChart data={data} />
      </div>
      <ReleaseEvolutionChart data={data} />
      <ReleaseDistributionTable data={data} />
    </div>
  );
}
