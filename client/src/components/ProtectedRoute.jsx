// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ token, children }) {
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}