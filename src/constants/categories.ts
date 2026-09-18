export const MAIN_CATEGORIES_ORDER = [
  'Composant',
  'Devops / Architecture',
  'MCO',
  'Documentation',
] as const;

/** Luciole chart-category tokens aligned with bleu_iceberg theme */
export const CHART_CATEGORY_TOKENS = [
  'var(--chart-category-1)',
  'var(--chart-category-6)',
  'var(--chart-category-4)',
  'var(--chart-category-3)',
  'var(--chart-category-5)',
  'var(--chart-category-7)',
  'var(--chart-category-8)',
  'var(--chart-neutral)',
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Composant: CHART_CATEGORY_TOKENS[0],
  'Devops / Architecture': CHART_CATEGORY_TOKENS[1],
  MCO: CHART_CATEGORY_TOKENS[2],
  Documentation: CHART_CATEGORY_TOKENS[3],
};

export function getCategoryColor(name: string, index: number): string {
  return CATEGORY_COLORS[name] ?? CHART_CATEGORY_TOKENS[index % CHART_CATEGORY_TOKENS.length];
}

export function getMainCategoryColor(category: string): string {
  const index = MAIN_CATEGORIES_ORDER.indexOf(category as (typeof MAIN_CATEGORIES_ORDER)[number]);
  return index >= 0 ? CHART_CATEGORY_TOKENS[index] : CHART_CATEGORY_TOKENS[4];
}
