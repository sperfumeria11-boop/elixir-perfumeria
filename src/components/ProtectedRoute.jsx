import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#8B7355' }}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default ProtectedRoute;