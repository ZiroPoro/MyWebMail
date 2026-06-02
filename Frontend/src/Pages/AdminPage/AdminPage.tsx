import { useCallback, useEffect, useState } from 'react';
import Header from '../../components/Header';
import { deleteUser, fetchUsers, type User } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import './AdminPage.css';

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setUsers(await fetchUsers());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleDelete(id: string, email: string) {
    if (!window.confirm(`Удалить пользователя ${email}?`)) {
      return;
    }
    setDeletingId(id);
    setError(null);
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось удалить');
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <Header title="Администрирование" />
      <main className="page-content admin-page">
        <section className="admin-card">
          <h2>Пользователи</h2>
          {loading && <p className="status">Загрузка…</p>}
          {error && <p className="status error">{error}</p>}
          {!loading && !error && (
            <div className="users-table-wrap">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Роль</th>
                    <th>Дата регистрации</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.email}</td>
                      <td>{u.role === 'ADMIN' ? 'Администратор' : 'Пользователь'}</td>
                      <td>{new Date(u.registeredAt).toLocaleString('ru-RU')}</td>
                      <td>
                        <button
                          type="button"
                          className="btn-delete"
                          disabled={u.id === currentUser?.id || deletingId === u.id}
                          onClick={() => handleDelete(u.id, u.email)}
                        >
                          {deletingId === u.id ? '…' : 'Удалить'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
