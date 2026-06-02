import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from './ProtectedRoute';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      {user?.role === 'ADMIN' ? children : <Navigate to="/WebMail" replace />}
    </ProtectedRoute>
  );
}
