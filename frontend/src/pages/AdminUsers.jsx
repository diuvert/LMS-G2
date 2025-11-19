import { useEffect, useState } from 'react';
import { apiAuth } from '../services/api.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const load = async () => {
    try {
      const { data } = await apiAuth().get('/users');
      setUsers(data);
    } catch (e) {
      setError('Need admin role');
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <h2>All Users (Admin)</h2>
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {users.map((u) => (
          <li key={u._id}>{u.name} – {u.email} ({u.role})</li>
        ))}
      </ul>
    </div>
  );
}
