import { useEffect, useState } from 'react';
import { apiAuth } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Enrollments() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courseId, setCourseId] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    const { data } = await apiAuth().get('/enrollments');
    setEnrollments(data);
  };

  useEffect(() => { load(); }, []);

  const enroll = async (e) => {
    e.preventDefault();
    try {
      await apiAuth().post('/enrollments', { courseId });
      setCourseId('');
      load();
    } catch (e) {
      setError('Enroll failed');
    }
  };

  return (
    <div>
      <h2>My Enrollments</h2>
      {user?.role === 'student' && (
        <form onSubmit={enroll} className="inline-form">
          <input placeholder="Course ID" value={courseId} onChange={(e) => setCourseId(e.target.value)} />
          <button>Enroll</button>
        </form>
      )}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {enrollments.map((e) => (
          <li key={e._id}>
            {e.course?.title} – Status: {e.status}
          </li>
        ))}
      </ul>
    </div>
  );
}
