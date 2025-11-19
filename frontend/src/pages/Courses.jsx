import { useEffect, useState } from 'react';
import { apiAuth } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await apiAuth().get('/courses');
    setCourses(data);
  };

  useEffect(() => { load(); }, []);

  const createCourse = async (e) => {
    e.preventDefault();
    try {
      await apiAuth().post('/courses', form);
      setForm({ title: '', description: '' });
      load();
    } catch (e) {
      setError('Could not create course');
    }
  };

  return (
    <div>
      <h2>Courses</h2>
      {user?.role === 'instructor' || user?.role === 'admin' ? (
        <form onSubmit={createCourse} className="inline-form">
          <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button>Create</button>
        </form>
      ) : (
        <p>Login as instructor to create courses.</p>
      )}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {courses.map((c) => (
          <li key={c._id}>
            <strong>{c.title}</strong> – {c.description} ({c.instructor?.name || 'Unknown'})
          </li>
        ))}
      </ul>
    </div>
  );
}
