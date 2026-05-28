import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router';
import Header from '../../components/Header';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (email.trim() && password.trim()) {
      sessionStorage.setItem('webmail-user', email.trim());
      navigate('/WebMail');
    }
  }

  return (
    <div>
      <Header title="Вход в систему" />
      <main className="page-content login-page">
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
            />
          </label>
          <label>
            Пароль
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit">Войти</button>
        </form>
        <p className="login-hint">Демо-вход: любой email и пароль.</p>
      </main>
    </div>
  );
}
