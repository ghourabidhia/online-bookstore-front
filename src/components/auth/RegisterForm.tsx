import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import type { RegisterRequest } from '@/types/auth.types';
import { useAuth } from '@/context/AuthContext';

export function RegisterForm() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterRequest>();

  const onSubmit = async (data: RegisterRequest) => {
    setServerError(null);
    try {
      await registerUser(data);
      navigate('/books', { replace: true });
    } catch (err) {
      if (isAxiosError(err) && err.response) {
        const { status } = err.response;
        setServerError(
          status === 409
            ? 'An account with this email already exists.'
            : 'Something went wrong. Please try again.'
        );
      } else {
        setServerError('Unable to reach the server. Check your connection.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <div className="alert alert-danger py-2" role="alert">
          {serverError}
        </div>
      )}

      <div className="row mb-3">
        <div className="col-6">
          <label htmlFor="firstname" className="form-label">
            First name
          </label>
          <input
            id="firstname"
            type="text"
            autoComplete="given-name"
            className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
            {...register('firstname', { required: 'First name is required' })}
          />
          {errors.firstname && (
            <div className="invalid-feedback">{errors.firstname.message}</div>
          )}
        </div>
        <div className="col-6">
          <label htmlFor="lastname" className="form-label">
            Last name
          </label>
          <input
            id="lastname"
            type="text"
            autoComplete="family-name"
            className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
            {...register('lastname', { required: 'Last name is required' })}
          />
          {errors.lastname && (
            <div className="invalid-feedback">{errors.lastname.message}</div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email address',
            },
          })}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email.message}</div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />
        {errors.password && (
          <div className="invalid-feedback">{errors.password.message}</div>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Creating account…
          </>
        ) : (
          'Create account'
        )}
      </button>

      <p className="mt-3 mb-0 text-center small">
        Already have an account?{' '}
        <Link to="/login">Sign in</Link>
      </p>
    </form>
  );
}
