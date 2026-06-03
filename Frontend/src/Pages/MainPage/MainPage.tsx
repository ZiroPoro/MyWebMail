import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Header from '../../components/Header';
import {
  fetchAddresses,
  fetchInbox,
  fetchSent,
  sendMail,
  type MailMessage,
} from '../../api/mailApi';
import { useAuth } from '../../context/AuthContext';
import './MainPage.css';

type Tab = 'inbox' | 'sent' | 'compose';

export default function MainPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>('inbox');
  const [messages, setMessages] = useState<MailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<string[]>([]);
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const loadMail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = tab === 'sent' ? await fetchSent() : await fetchInbox();
      setMessages(data.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    if (tab === 'compose') {
      setLoading(false);
      fetchAddresses()
        .then(setAddresses)
        .catch(() => setAddresses([]));
      return;
    }
    loadMail();
  }, [tab, loadMail]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);
    try {
      await sendMail(toEmail.trim(), subject.trim(), body.trim());
      setToEmail('');
      setSubject('');
      setBody('');
      setTab('sent');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось отправить');
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Header title="Почта" />
      <main className="page-content mail-page">
        <p className="mail-greeting">Вы вошли как: <b>{user?.email}</b></p>

        <div className="mail-tabs">
          <button type="button" className={tab === 'inbox' ? 'active' : ''} onClick={() => setTab('inbox')}>
            Входящие
          </button>
          <button type="button" className={tab === 'sent' ? 'active' : ''} onClick={() => setTab('sent')}>
            Отправленные
          </button>
          <button type="button" className={tab === 'compose' ? 'active' : ''} onClick={() => setTab('compose')}>
            Написать
          </button>
        </div>

        {error && <p className="status error">{error}</p>}

        {tab === 'compose' ? (
          <form className="compose-form" onSubmit={handleSend}>
            <label>
              Кому
              <input
                list="emails-list"
                value={toEmail}
                onChange={(e) => setToEmail(e.target.value)}
                placeholder="email получателя"
                required
              />
              <datalist id="emails-list">
                {addresses.map((email) => (
                  <option key={email} value={email} />
                ))}
              </datalist>
            </label>
            <label>
              Тема
              <input value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </label>
            <label>
              Текст
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} required />
            </label>
            <button type="submit" disabled={sending}>
              {sending ? 'Отправка…' : 'Отправить'}
            </button>
          </form>
        ) : (
          <>
            {loading && <p className="status">Загрузка…</p>}
            {!loading && messages.length === 0 && <p className="status">Писем пока нет</p>}
            {!loading && messages.length > 0 && (
              <ul className="mail-list">
                {messages.map((msg) => (
                  <li key={msg.id} className="mail-item">
                    <div className="mail-item__head">
                      <strong>{tab === 'inbox' ? msg.from : msg.to}</strong>
                      <time>{new Date(msg.sentAt).toLocaleString('ru-RU')}</time>
                    </div>
                    <h2>{msg.subject}</h2>
                    <p>{msg.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </>
  );
}
