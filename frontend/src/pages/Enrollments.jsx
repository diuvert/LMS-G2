import { useEffect, useState } from 'react';
import { apiAuth } from '../services/api.js';
import { BookOpen, Calendar, TrendingUp, Play, Trash2 } from 'lucide-react';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);

  const load = async () => {
    try {
      const { data } = await apiAuth().get('/enrollments');
      setEnrollments(data);
    } catch (e) {
      console.error(e);
    }
  };

  const dropCourse = async (id) => {
    if (!confirm('Are you sure you want to drop this course?')) return;
    try {
      await apiAuth().delete(`/enrollments/${id}`);
      load();
    } catch (e) {
      alert('Could not drop course');
    }
  };

  useEffect(() => { load(); }, []);

  const totalCourses = enrollments.length;
  const inProgress = enrollments.filter(e => e.status === 'enrolled').length;
  const completed = enrollments.filter(e => e.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Enrollments</h1>
        <p className="text-gray-600">Track your enrolled courses and progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Courses</span>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalCourses} Courses</div>
        </div>
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">In Progress</span>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{inProgress} Courses</div>
        </div>
        <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Completed</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{completed} Course{completed !== 1 && 's'}</div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{enrollment.course?.title}</div>
                        <div className="text-sm text-gray-500">Next: Module 1</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{enrollment.course?.instructor?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(enrollment.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2 w-24">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: enrollment.status === 'completed' ? '100%' : '45%' }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{enrollment.status === 'completed' ? '100%' : '45%'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${enrollment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                        }`}
                    >
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="inline-flex items-center px-3 py-1 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                      <Play className="h-4 w-4 mr-1" />
                      {enrollment.status === 'completed' ? 'Review' : 'Continue'}
                    </button>
                    <button
                      onClick={() => dropCourse(enrollment._id)}
                      className="ml-2 inline-flex items-center px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                      title="Drop Course"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
