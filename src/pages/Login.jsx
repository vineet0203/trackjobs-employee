import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (searchParams.get('passwordSet') === '1') {
      setSuccessMessage('Password set successfully. Please log in.');
    }
  }, [searchParams]);

  const validate = () => {
    const nextErrors = {};

    if (!email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = 'Enter a valid email address.';
    }

    if (!password) {
      nextErrors.password = 'Password is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setApiError('');

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        email: email.trim(),
        password,
      };

      const response = await api.post('/employee/login', payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const token = response?.data?.data?.token;
      const employee = response?.data?.data?.employee || {};

      if (!token) {
        throw new Error('Token not found in login response.');
      }

      localStorage.setItem('employee_token', token);
      localStorage.setItem('employee_auth_employee', JSON.stringify(employee));

      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message || error?.message || 'Employee login failed.';

      if (message === 'Please set your password first') {
        navigate(`/set-password?email=${encodeURIComponent(email)}`, { replace: true });
        return;
      }

      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="employee-login-page">
      <div className="employee-login-card">
        <h1 className="employee-login-title">Employee Login</h1>
        <p className="employee-login-subtitle">Sign in to access your employee dashboard.</p>

        {successMessage ? <div className="employee-login-success">{successMessage}</div> : null}
        {apiError ? <div className="employee-login-alert">{apiError}</div> : null}

        <form onSubmit={handleSubmit} className="employee-login-form" noValidate>
          <label className="employee-login-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={`employee-login-input ${errors.email ? 'has-error' : ''}`}
            placeholder="Enter email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onBlur={validate}
          />
          {errors.email ? <span className="employee-login-error">{errors.email}</span> : null}

          <label className="employee-login-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className={`employee-login-input ${errors.password ? 'has-error' : ''}`}
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onBlur={validate}
          />
          {errors.password ? <span className="employee-login-error">{errors.password}</span> : null}

          <button type="submit" className="employee-login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
