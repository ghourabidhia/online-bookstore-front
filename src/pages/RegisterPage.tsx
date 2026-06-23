import { RegisterForm } from '@/components/auth/RegisterForm';

export function RegisterPage() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm w-100" style={{ maxWidth: 480 }}>
        <div className="card-body p-4 p-md-5">
          <h1 className="h4 fw-bold text-center mb-4">Create your account</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
