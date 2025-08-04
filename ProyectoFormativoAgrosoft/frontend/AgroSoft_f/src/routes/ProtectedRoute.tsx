import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../hooks/UseAuth";
import { useEffect, useState } from "react";
import { CircularProgress } from '@heroui/react';

const ProtectedRoute = () => {
  const { token, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos un pequeño retraso para permitir que la verificación del token se complete
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  return token && isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;