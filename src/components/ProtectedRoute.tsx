import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) return <Loader label="Vérification de la session…" />;
  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }
  return children;
}
