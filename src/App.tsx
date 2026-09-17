import { useState } from 'react';
import type { TaskRow } from './types';
import { FileInput } from './components/FileInput';
import { AnalyticsReports } from './components/AnalyticsReports';
import { useAnalytics } from './hooks/useAnalytics';
import styles from './App.module.scss';

function App() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const analytics = useAnalytics(tasks);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>GOPro Tickets Résolus</h1>
        <p className={styles.subtitle}>Analytics &amp; Rapports</p>
      </header>

      <main className={styles.main}>
        <FileInput
          onLoad={(data, info) => {
            setTasks(data);
            setError('');
            if (info.skippedRows > 0) {
              const detail = info.warnings.length > 0
                ? ` (${info.warnings.slice(0, 3).join('; ')}${info.warnings.length > 3 ? '…' : ''})`
                : '';
              setWarning(`${info.skippedRows} ticket(s) ignoré(s)${detail}`);
            } else {
              setWarning('');
            }
          }}
          onError={(message) => {
            setError(message);
            setWarning('');
          }}
        />

        {error && (
          <div className={styles.error} role="alert">
            {error}
          </div>
        )}

        {warning && (
          <div className={styles.warning} role="status">
            {warning}
          </div>
        )}

        {analytics && <AnalyticsReports data={analytics} />}
      </main>
    </div>
  );
}

export default App;
