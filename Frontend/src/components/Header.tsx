import { useNavigate } from 'react-router';
import './Header.css';
import Navbar from './Navbar';
import logoUrl from './assets/react.svg';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Добро пожаловать' }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    await logout();
    navigate('/Login');
  }

  return (
    <header className="login-header">
      <div className="header-container">
        <div className="logo">
          <img src={logoUrl} alt="logo" className="logo-image" />
        </div>
        <Navbar />
        <div className="header-right">
          <h1 className="header-title">{title}</h1>
          {user && (
            <div className="header-user">
              <span>{user.email}</span>
              <button type="button" className="btn-logout" onClick={handleLogout}>
                Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
