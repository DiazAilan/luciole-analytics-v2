import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ToastQueueProvider } from '@design-system-rte/react';
import '@design-system-rte/react/style.css';
import '@design-system-rte/core/css/bleu_iceberg.css';
import './index.scss';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastQueueProvider>
      <App />
    </ToastQueueProvider>
  </StrictMode>,
);
