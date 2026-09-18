import { useState } from 'react';
import { Banner, Header, Toast } from '@design-system-rte/react';
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
      <Header
        appearance="brand"
        hasSearchbar={false}
        hasAvatar={false}
        hasRightSection={false}
        leftSectionContent={
          <div className={styles.headerTitle}>
            <span className={styles.headerAppName}>Évaluation Charge Technique Luciole</span>
            <span className={styles.headerSubtitle}>Analytics &amp; Rapports</span>
          </div>
        }
      />

      <main className={styles.main}>
        {!analytics && (
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
        )}

        {error && (
          <div className={styles.feedback}>
            <Banner type="error" message={error} position="push" />
          </div>
        )}

        {warning && (
          <Toast
            key={warning}
            type="info"
            message={warning}
            isOpen
            closable
            showActionButton={false}
            onClose={() => setWarning('')}
          />
        )}

        {analytics && <AnalyticsReports data={analytics} />}
      </main>
    </div>
  );
}

export default App;
