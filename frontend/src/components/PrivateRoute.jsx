import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

export default function PrivateRoute() {
  const { token } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Outlet />
      </div>
    </>
  );
}