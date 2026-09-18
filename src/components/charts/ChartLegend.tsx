import styles from './ChartLegend.module.scss';

export interface ChartLegendItem {
  name: string;
  color: string;
  percent?: number;
}

interface ChartLegendProps {
  items: ChartLegendItem[];
  layout?: 'list' | 'inline';
}

function LegendEntry({ item }: { item: ChartLegendItem }) {
  return (
    <>
      <span className={styles.dot} style={{ background: item.color }} aria-hidden="true" />
      <span className={styles.name}>{item.name}</span>
      {item.percent !== undefined && (
        <span className={styles.percent}>{item.percent.toFixed(1)}%</span>
      )}
    </>
  );
}

export function ChartLegend({ items, layout = 'list' }: ChartLegendProps) {
  if (layout === 'inline') {
    return (
      <div className={`${styles.legend} ${styles.inline}`}>
        {items.map((item) => (
          <span key={item.name} className={styles.legendItem}>
            <LegendEntry item={item} />
          </span>
        ))}
      </div>
    );
  }

  return (
    <ul className={styles.legend}>
      {items.map((item) => (
        <li key={item.name} className={styles.legendItem}>
          <LegendEntry item={item} />
        </li>
      ))}
    </ul>
  );
}
