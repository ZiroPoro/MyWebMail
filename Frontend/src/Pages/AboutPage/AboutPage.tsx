import Header from '../../components/Header';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <>
      <Header title="О проекте" />
      <main className="page-content about-page">
        <p>
          <strong>MyWebMail</strong> — учебный веб-клиент почты на React и Spring Boot.
        </p>
        <ul>
          <li>JWT, Spring Security, PostgreSQL, Flyway, Docker</li>
          <li>Отправка писем между пользователями</li>
          <li>Админ-панель: пользователи и даты регистрации</li>
        </ul>
      </main>
    </>
  );
}