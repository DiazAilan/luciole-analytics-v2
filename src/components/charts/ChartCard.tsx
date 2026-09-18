import { Card } from '@design-system-rte/react';
import type { ReactNode } from 'react';
import styles from './ChartCard.module.scss';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function ChartCard({ title, subtitle, headerAction, children }: ChartCardProps) {
  return (
    <Card width="100%">
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {headerAction && <div className={styles.action}>{headerAction}</div>}
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </Card>
  );
}
