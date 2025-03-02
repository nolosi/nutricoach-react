import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useUser();
  
  // Warte, bis die Benutzerdaten geladen sind
  if (isLoading) {
    return <div>Laden...</div>;
  }
  
  // Wenn der Benutzer das Onboarding nicht abgeschlossen hat, leite ihn zur Onboarding-Seite weiter
  if (!user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Andernfalls zeige die angeforderte Komponente an
  return <>{children}</>;
};

export default ProtectedRoute; 