import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="status page-content">Проверка входа…</p>;
  }

  if (!user) {
    return <Navigate to="/Login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
