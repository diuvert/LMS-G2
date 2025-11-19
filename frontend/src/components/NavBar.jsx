import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <nav className="nav">
      <span className="brand">LMS</span>
      <Link to="/courses">Courses</Link>
      {user && <Link to="/enrollments">My Enrollments</Link>}
      {user?.role === 'admin' && <Link to="/admin/users">Users</Link>}
      <div className="right">
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <>
            <span>{user.name} ({user.role})</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
