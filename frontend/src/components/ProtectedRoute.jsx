import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Wrap a page to require login (and optionally the admin role).
 *   <ProtectedRoute><DashboardPage /></ProtectedRoute>
 *   <ProtectedRoute adminOnly><AdminEventsPage /></ProtectedRoute>
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <div className="spinner" aria-label="Checking login" />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && user.role !== 'admin') {
    return (
      <main className="container section">
        <div className="alert alert-error">Only administrators can open this page.</div>
      </main>
    );
  }

  return children;
}
