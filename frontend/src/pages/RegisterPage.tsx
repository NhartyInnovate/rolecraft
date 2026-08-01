import React from 'react';
import { AuthLayout } from '../layouts/AuthLayout';
import { RegisterCard } from '../features/auth/RegisterCard';

export const RegisterPage: React.FC = () => {
  return (
    <AuthLayout>
      <RegisterCard />
    </AuthLayout>
  );
};
