import type { FC } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { tokens } from '@/theme';
import { LoaderIcon } from '@/components/Icon/icons';

export const GuestRoute: FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: tokens.bg,
      }}>
        <span style={{ animation: 'spin 0.8s linear infinite', display: 'flex' }}>
          <LoaderIcon color={tokens.accent} size={32} />
        </span>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
