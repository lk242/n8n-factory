import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import router from './routes';
import './styles.css';

async function enableMocking() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return;
  }

  const { setupMockWorker } = await import('./mocks/browser');
  await setupMockWorker();
}

const queryClient = new QueryClient();

enableMocking().finally(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </React.StrictMode>
  );
});
