import { useMemo } from 'react';
import type { AnalyticsData, CategoryStats, ReleaseStats, TaskRow } from '../types';

function extractTaskId(task: string): string {
  const match = task.match(/^(DSR-\d+)/);
  return match?.[1] ?? task;
}

export function useAnalytics(tasks: TaskRow[]): AnalyticsData | null {
  return useMemo(() => {
    if (!tasks.length) return null;

    const releaseMap = new Map<string, { releaseLabel: string; count: number; categories: Record<string, number> }>();
    const categoryMap = new Map<string, Set<string>>();
    const uniqueTaskIds = new Set<string>();

    for (const row of tasks) {
      const taskId = extractTaskId(row.task);
      uniqueTaskIds.add(`${row.release}-${taskId}`);

      if (!releaseMap.has(row.release)) {
        releaseMap.set(row.release, {
          releaseLabel: row.releaseLabel,
          count: 0,
          categories: {},
        });
      }

      const releaseData = releaseMap.get(row.release)!;
      releaseData.count += 1;
      releaseData.categories[row.category] = (releaseData.categories[row.category] || 0) + 1;

      if (!categoryMap.has(row.category)) {
        categoryMap.set(row.category, new Set());
      }
      categoryMap.get(row.category)!.add(row.release);
    }

    const releaseStats: ReleaseStats[] = Array.from(releaseMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([release, data]) => ({
        release,
        releaseLabel: data.releaseLabel,
        count: data.count,
        categories: data.categories,
      }));

    const categoryStats: CategoryStats[] = Array.from(categoryMap.entries())
      .map(([category, releases]) => ({
        category,
        count: tasks.filter((t) => t.category === category).length,
        releases: Array.from(releases).sort((a, b) => a.localeCompare(b)),
      }))
      .sort((a, b) => b.count - a.count);

    const releaseDates = releaseStats.map((r) => r.release);

    return {
      tasks,
      totalTasks: tasks.length,
      releaseStats,
      categoryStats,
      uniqueTasks: uniqueTaskIds.size,
      releaseRange: {
        min: releaseDates[0] ?? '',
        max: releaseDates[releaseDates.length - 1] ?? '',
      },
    };
  }, [tasks]);
}
