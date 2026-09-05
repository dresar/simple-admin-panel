import React from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LoginForm } from '@/components/admin/auth/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const from = (location.state as { from?: Location })?.from?.pathname || '/admin';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLoginSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full fade-in">
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
}
