import { setupWorker } from 'msw';
import { handlers } from './handlers';

let worker: ReturnType<typeof setupWorker> | null = null;

export async function setupMockWorker() {
  if (worker) {
    return worker.start();
  }
  worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: 'bypass' });
  return worker;
}
