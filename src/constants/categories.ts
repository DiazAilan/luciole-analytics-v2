export const MAIN_CATEGORIES_ORDER = [
  'Composant',
  'Devops / Architecture',
  'MCO',
  'Documentation',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Composant: '#4a90d9',
  'Devops / Architecture': '#e06c4a',
  MCO: '#2ecc71',
  Documentation: '#9b59b6',
};

export const FALLBACK_COLORS = ['#4a90d9', '#e06c4a', '#2ecc71', '#9b59b6', '#8b949e'];

export function getCategoryColor(name: string, index: number): string {
  return CATEGORY_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}
