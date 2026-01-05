import type { Metadata } from 'next';
import { AuthLayout } from '@/components/layouts/auth-layout';
import { LoginForm } from '@/components/features/login-form';

export const metadata: Metadata = {
  title: 'Login | RemitFlow Admin',
  description: 'Sign in to RemitFlow admin dashboard',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900">
            RemitFlow Admin
          </h1>
          <p className="text-neutral-600 mt-2">
            Sign in to access the dashboard
          </p>
        </div>

        <LoginForm />
      </div>
    </AuthLayout>
  );
}
