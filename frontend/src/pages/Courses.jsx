import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiAuth } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Search, BookOpen, Clock, Users, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Courses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const load = async () => {
    try {
      const { data } = await apiAuth().get('/courses');
      setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiAuth().put(`/courses/${editingId}`, form);
        setEditingId(null);
      } else {
        await apiAuth().post('/courses', form);
      }
      setForm({ title: '', description: '' });
      load();
    } catch (e) {
      setError('Could not save course');
    }
  };

  const handleEdit = (course) => {
    setForm({ title: course.title, description: course.description });
    setEditingId(course._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await apiAuth().delete(`/courses/${id}`);
      load();
    } catch (e) {
      setError('Could not delete course');
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      await apiAuth().post('/enrollments', { courseId });
      alert('Successfully enrolled in the course!');
      navigate('/enrollments');
    } catch (e) {
      if (e.response?.status === 409) {
        alert('You are already enrolled in this course');
      } else {
        alert('Could not enroll in course. Please try again.');
      }
      console.error(e);
    }
  };

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses Page</h1>
        <p className="text-gray-600">Browse and enroll in available courses</p>
      </div>

      {/* Create Course - Instructors/Admin */}
      {(user?.role === 'instructor' || user?.role === 'admin') && (
        <div className="mb-8 bg-white p-6 border-2 border-gray-300 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingId ? 'Edit Course' : 'Create New Course'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="Course Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />

              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingId ? <Edit2 className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {editingId ? 'Update Course' : 'Create Course'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ title: '', description: '' });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>

            {error && <p className="text-red-600">{error}</p>}
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        {filteredCourses.map((course) => (

          <div
            key={course._id}
            className="bg-white border-2 border-gray-300 rounded-lg p-6 hover:border-blue-500 transition flex flex-col h-full"
          >
            {/* Icon + Level Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>

              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {course.level || 'Beginner'}
              </span>
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>

            {/* Students + Duration */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>{course.studentCount?.toLocaleString() || 0} students</span>
              </div>

              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                <span>{course.duration || 'Unknown'}</span>
              </div>
            </div>

            {/* Instructor + Enroll button (pushed to bottom) */}
            <div className="border-t border-gray-200 pt-4 mt-auto">
              <p className="text-gray-600 mb-4">
                Instructor: {course.instructor?.name || 'Unknown'}
              </p>

              <button
                onClick={() => handleEnroll(course._id)}
                className="w-full py-2 px-4 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition"
              >
                Enroll Now
              </button>

              {(user?.role === 'admin' || (user?.role === 'instructor' && course.instructor?._id === user?.id)) && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center"
                  >
                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 py-2 px-4 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>

        ))}
      </div>
    </div>
  );
}
