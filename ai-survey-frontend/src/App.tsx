import { NavLink, Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-brand">AI Survey</div>
        <nav className="app-nav">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            儀表板
          </NavLink>
          <NavLink to="/survey/1" className={({ isActive }) => (isActive ? 'active' : undefined)}>
            問卷填寫
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
