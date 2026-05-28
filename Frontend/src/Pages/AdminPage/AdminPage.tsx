import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { fetchInbox } from '../../api/mailApi';
import './AdminPage.css';

export default function AdminPage() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchInbox()
      .then((items) => setCount(items.length))
      .catch(() => setCount(0));
  }, []);

  return (
    <>
      <Header title="Администрирование" />
      <main className="page-content admin-page">
        <section className="admin-card">
          <h2>Статистика</h2>
          <p>Сообщений во входящих: <strong>{count}</strong></p>
          <p>Backend: Spring Boot, порт 8080</p>
          <p>Frontend: React + Vite, порт 5173</p>
        </section>
      </main>
    </>
  );
}
