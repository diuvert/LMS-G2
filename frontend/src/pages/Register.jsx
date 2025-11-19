import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const ok = await register(form.name, form.email, form.password, form.role);
    if (!ok) setError('Registration failed');
    else navigate('/courses');
  };

  return (
    <div className="card">
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input name="name" placeholder="Name" value={form.name} onChange={change} />
        <input name="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} />
        <select name="role" value={form.role} onChange={change}>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>
        <button disabled={loading}>{loading ? 'Loading...' : 'Create Account'}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
