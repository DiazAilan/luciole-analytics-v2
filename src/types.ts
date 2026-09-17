export interface TaskRow {
  task: string;
  category: string;
  type: string;
  release: string;
  releaseLabel: string;
}

export interface ReleaseStats {
  release: string;
  releaseLabel: string;
  count: number;
  categories: Record<string, number>;
}

export interface CategoryStats {
  category: string;
  count: number;
  releases: string[];
}

export interface AnalyticsData {
  tasks: TaskRow[];
  totalTasks: number;
  releaseStats: ReleaseStats[];
  categoryStats: CategoryStats[];
  uniqueTasks: number;
  releaseRange: { min: string; max: string };
}

export interface ParseResult {
  tasks: TaskRow[];
  skippedRows: number;
  warnings: string[];
}
