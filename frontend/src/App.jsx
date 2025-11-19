import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Courses from './pages/Courses.jsx';
import Enrollments from './pages/Enrollments.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/courses" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses" element={<Courses />} />
          <Route
            path="/enrollments"
            element={<ProtectedRoute roles={['student','instructor','admin']}><Enrollments /></ProtectedRoute>}
          />
          <Route
            path="/admin/users"
            element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
