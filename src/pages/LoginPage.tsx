import { LoginForm } from '@/components/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm w-100" style={{ maxWidth: 420 }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 fw-bold text-center mb-4">Sign in to Bookstore</h1>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
