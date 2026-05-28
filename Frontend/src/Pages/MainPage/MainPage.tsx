import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { fetchInbox, type MailMessage } from '../../api/mailApi';
import './MainPage.css';

export default function MainPage() {
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInbox()
      .then(setMessages)
      .catch(() => setError('Не удалось загрузить почту. Запустите Backend на порту 8080.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Header title="Входящие" />
      <main className="page-content">
        {loading && <p className="status">Загрузка…</p>}
        {error && <p className="status error">{error}</p>}
        {!loading && !error && (
          <ul className="mail-list">
            {messages.map((msg) => (
              <li key={msg.id} className="mail-item">
                <div className="mail-item__head">
                  <strong>{msg.from}</strong>
                  <time>{new Date(msg.receivedAt).toLocaleString('ru-RU')}</time>
                </div>
                <h2>{msg.subject}</h2>
                <p>{msg.preview}</p>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}