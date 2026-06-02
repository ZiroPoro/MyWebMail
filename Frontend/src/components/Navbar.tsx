import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="Navbar">
      <Link to="/WebMail">Главная</Link>
      {!user && <Link to="/Login">Вход</Link>}
      {user?.role === 'ADMIN' && <Link to="/Admin">Администрирование</Link>}
      <Link to="/About">О почте</Link>
    </nav>
  );
}
