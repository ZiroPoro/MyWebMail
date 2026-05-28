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
          <li>Просмотр демо-входящих через REST API</li>
          <li>Маршрутизация страниц: главная, вход, админка, о проекте</li>
          <li>Готовность к подключению SMTP/IMAP в следующих итерациях</li>
        </ul>
      </main>
    </>
  );
}