import { Link } from 'react-router';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/WebMail">На главную</Link>
    </div>
  );
}
