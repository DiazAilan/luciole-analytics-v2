const USER_ANOMALY_MARKER = '[anomalie dev]';
const USER_EVOLUTION_MARKER = '[évolution dev]';

function normalizeTaskTitle(task: string): string {
  return task.normalize('NFC').toLowerCase();
}

export function isUserAnomalyTask(task: string): boolean {
  return normalizeTaskTitle(task).includes(USER_ANOMALY_MARKER);
}

export function isUserEvolutionTask(task: string): boolean {
  return normalizeTaskTitle(task).includes(USER_EVOLUTION_MARKER);
}

export function countUserAnomalyTasks(tasks: { task: string }[]): number {
  return tasks.filter((row) => isUserAnomalyTask(row.task)).length;
}

export function countUserEvolutionTasks(tasks: { task: string }[]): number {
  return tasks.filter((row) => isUserEvolutionTask(row.task)).length;
}
