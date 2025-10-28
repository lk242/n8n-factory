import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Survey from './pages/Survey';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'survey/:id', element: <Survey /> }
    ]
  }
]);

export default router;
