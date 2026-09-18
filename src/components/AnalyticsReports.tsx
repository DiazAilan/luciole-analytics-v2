import { useMemo, useState } from 'react';
import { Grid } from '@design-system-rte/react';
import type { AnalyticsData } from '../types';
import { CHARGE_DISTRIBUTION_START } from '../constants/dateDefaults';
import { buildAnalytics } from '../hooks/useAnalytics';
import { filterTasksByReleaseRange, isoToDate, today } from '../utils/dateRange';
import { SummaryCards } from './SummaryCards';
import { CategoryDistributionPie } from './CategoryDistributionPie';
import { ReleasePieChart } from './ReleasePieChart';
import { ReleaseEvolutionChart } from './ReleaseEvolutionChart';
import { ReleaseDistributionTable } from './ReleaseDistributionTable';
import styles from './AnalyticsReports.module.scss';

type DateRangeValue = [Date | null, Date | null] | null;

const EMPTY_ANALYTICS: AnalyticsData = {
  tasks: [],
  totalTasks: 0,
  userAnomalyTasks: 0,
  userEvolutionTasks: 0,
  releaseStats: [],
  categoryStats: [],
  uniqueTasks: 0,
  releaseRange: { min: '', max: '' },
};

interface AnalyticsReportsProps {
  data: AnalyticsData;
}

export function AnalyticsReports({ data }: AnalyticsReportsProps) {
  const defaultRange = useMemo((): [Date, Date] => {
    const end = today();
    const start = CHARGE_DISTRIBUTION_START;
    return [start, end < start ? start : end];
  }, []);

  const pickerBounds = useMemo((): [Date, Date] => {
    const dataMin = isoToDate(data.releaseRange.min);
    const end = today();
    const min = dataMin < CHARGE_DISTRIBUTION_START ? dataMin : CHARGE_DISTRIBUTION_START;
    return [min, end];
  }, [data.releaseRange.min]);

  const [dateRange, setDateRange] = useState<DateRangeValue>(null);
  const activeRange = dateRange ?? defaultRange;

  const filteredData = useMemo(() => {
    const tasks = filterTasksByReleaseRange(data.tasks, activeRange);
    return buildAnalytics(tasks) ?? EMPTY_ANALYTICS;
  }, [data.tasks, activeRange]);

  return (
    <div className={styles.reports}>
      <SummaryCards data={filteredData} />
      <Grid gridType="fluid" className={styles.grid}>
        <Grid.Col xxs={12} l={6} className={styles.col}>
          <CategoryDistributionPie
            data={filteredData}
            dateRange={activeRange}
            onDateRangeChange={setDateRange}
            pickerBounds={pickerBounds}
          />
        </Grid.Col>
        <Grid.Col xxs={12} l={6} className={styles.col}>
          <ReleasePieChart data={data} />
        </Grid.Col>
      </Grid>
      <section className={styles.section}>
        <ReleaseEvolutionChart data={filteredData} />
      </section>
      <section className={styles.section}>
        <ReleaseDistributionTable data={filteredData} />
      </section>
    </div>
  );
}
