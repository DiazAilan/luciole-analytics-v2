import { Grid } from '@design-system-rte/react';
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
      <Grid gridType="fluid" className={styles.grid}>
        <Grid.Col xxs={12} l={6} className={styles.col}>
          <CategoryDistributionPie
            key={`charge-${data.releaseRange.min}-${data.releaseRange.max}-${data.totalTasks}`}
            data={data}
          />
        </Grid.Col>
        <Grid.Col xxs={12} l={6} className={styles.col}>
          <ReleasePieChart
            key={`release-${data.releaseRange.min}-${data.releaseRange.max}-${data.totalTasks}`}
            data={data}
          />
        </Grid.Col>
      </Grid>
      <section className={styles.section}>
        <ReleaseEvolutionChart data={data} />
      </section>
      <section className={styles.section}>
        <ReleaseDistributionTable data={data} />
      </section>
    </div>
  );
}
