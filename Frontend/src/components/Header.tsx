import './Header.css';
import Navbar from './Navbar';
import logoUrl from './assets/react.svg';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = 'Добро пожаловать' }: HeaderProps) {
  return (
    <header className="login-header">
      <div className="header-container">
        <div className="logo">
          <img src={logoUrl} alt="logo" className="logo-image" />
        </div>
        <Navbar />
        <h1 className="header-title">{title}</h1>
      </div>
    </header>
  );
}
