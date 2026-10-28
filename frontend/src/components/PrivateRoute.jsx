import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function PrivateRoute() {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <div className="app-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}