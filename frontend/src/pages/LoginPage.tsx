import React from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginCard } from '../features/auth/LoginCard';

export const LoginPage: React.FC = () => {
  return (
    <AuthLayout>
      <LoginCard />
    </AuthLayout>
  );
};
