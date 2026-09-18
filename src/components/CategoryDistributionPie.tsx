import { useMemo } from 'react';
import { DateRangePicker } from '@design-system-rte/react';
import type { AnalyticsData } from '../types';
import { getCategoryColor } from '../constants/categories';
import { ChartCard } from './charts/ChartCard';
import { ChartLegend } from './charts/ChartLegend';
import styles from './CategoryDistributionPie.module.scss';

type DateRangeValue = [Date | null, Date | null] | null;

function aggregateCategories(tasks: AnalyticsData['tasks']) {
  const categoryMap = new Map<string, number>();
  for (const task of tasks) {
    categoryMap.set(task.category, (categoryMap.get(task.category) ?? 0) + 1);
  }
  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

interface CategoryDistributionPieProps {
  data: AnalyticsData;
  dateRange: [Date | null, Date | null];
  onDateRangeChange: (range: DateRangeValue) => void;
  pickerBounds: [Date, Date];
}

export function CategoryDistributionPie({
  data,
  dateRange,
  onDateRangeChange,
  pickerBounds,
}: CategoryDistributionPieProps) {
  const categoryStats = useMemo(
    () => aggregateCategories(data.tasks).slice(0, 6),
    [data.tasks],
  );

  const total = categoryStats.reduce((sum, stat) => sum + stat.count, 0);

  const segments = categoryStats.map((stat, i) => ({
    name: stat.category,
    count: stat.count,
    percent: total > 0 ? (stat.count / total) * 100 : 0,
    color: getCategoryColor(stat.category, i),
  }));

  const conicParts = segments
    .map((s, i) => {
      const prev = segments.slice(0, i).reduce((a, b) => a + b.percent, 0);
      return `${s.color} ${prev}% ${prev + s.percent}%`;
    })
    .join(', ');

  return (
    <ChartCard
      title="Répartition de la charge"
      headerAction={
        <DateRangePicker
          id="charge-date-range"
          label="Période"
          value={dateRange}
          onChange={onDateRangeChange}
          minDate={pickerBounds[0]}
          maxDate={pickerBounds[1]}
          width="100%"
        />
      }
    >
      {total === 0 ? (
        <p className={styles.empty}>Aucun ticket pour la période sélectionnée.</p>
      ) : (
        <div className={styles.content}>
          <div
            className={styles.pie}
            style={{ background: `conic-gradient(${conicParts})` }}
            role="img"
            aria-label="Répartition par catégorie"
          />
          <ChartLegend
            items={segments.map((s) => ({
              name: s.name,
              color: s.color,
              percent: s.percent,
            }))}
          />
        </div>
      )}
    </ChartCard>
  );
}
