import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/dashboard/metrics', async () => {
    const response = await fetch('/mock-data/dashboard.json');
    const data = await response.json();
    return HttpResponse.json(data);
  }),
  http.post('/api/surveys/:id/submit', async ({ params }) => {
    const { id } = params as { id: string };
    return HttpResponse.json({ ok: true, id, receivedAt: new Date().toISOString() });
  }),
  http.get('/api/broadcast/survey-link', () => {
    return HttpResponse.json({ url: 'http://localhost:5173/survey/1' });
  })
];
