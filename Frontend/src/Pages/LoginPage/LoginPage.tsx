import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import Header from '../../components/Header';
import { useAuth } from '../../context/AuthContext';
import './LoginPage.css';

type Mode = 'login' | 'register';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo =
    (location.state as { from?: string } | null)?.from ?? '/WebMail';

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password);
      } else {
        await register(email.trim(), password);
      }
      navigate(redirectTo);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка авторизации');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Header title={mode === 'login' ? 'Вход в систему' : 'Регистрация'} />
      <main className="page-content login-page">
        <div className="login-tabs">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Вход
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => setMode('register')}
          >
            Регистрация
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Подождите…' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </main>
    </div>
  );
}
