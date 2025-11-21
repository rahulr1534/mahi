import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FileText, Plus, Download, Edit, Trash2, Briefcase, MessageSquare } from 'lucide-react';

const Dashboard = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/resumes`);
      setResumes(response.data);
    } catch {
      setError('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/api/resumes/${id}`);
      setResumes(resumes.filter(resume => resume._id !== id));
    } catch {
      setError('Failed to delete resume');
    }
  };

  const downloadResume = (resume) => {
    // Redirect to resume builder with this resume ID to enable PDF download
    window.location.href = `/resume-builder?id=${resume._id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Manage your resumes and find job opportunities</p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/resume-builder"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg border border-gray-700 transition duration-300"
        >
          <div className="flex items-center mb-4">
            <Plus className="h-8 w-8 text-blue-500 mr-3" />
            <h3 className="text-xl font-semibold text-white">Create Resume</h3>
          </div>
          <p className="text-gray-400">Build a new resume with AI assistance</p>
        </Link>

        <Link
          to="/job-search"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg border border-gray-700 transition duration-300"
        >
          <div className="flex items-center mb-4">
            <Briefcase className="h-8 w-8 text-green-500 mr-3" />
            <h3 className="text-xl font-semibold text-white">Find Jobs</h3>
          </div>
          <p className="text-gray-400">Discover job opportunities matching your skills</p>
        </Link>

        <Link
          to="/mock-interview"
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg border border-gray-700 transition duration-300"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="h-8 w-8 text-orange-500 mr-3" />
            <h3 className="text-xl font-semibold text-white">Mock Interviews</h3>
          </div>
          <p className="text-gray-400">Practice interviews with AI-powered feedback</p>
        </Link>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center mb-4">
            <FileText className="h-8 w-8 text-purple-500 mr-3" />
            <h3 className="text-xl font-semibold text-white">Templates</h3>
          </div>
          <p className="text-gray-400">Choose from professional, creative, and minimalist designs</p>
        </div>
      </div>

      {/* Resumes Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Your Resumes</h2>
            <Link
              to="/resume-builder"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Resume
            </Link>
          </div>
        </div>

        <div className="p-6">
          {resumes.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No resumes yet</h3>
              <p className="text-gray-400 mb-6">Create your first resume to get started</p>
              <Link
                to="/resume-builder"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Create Your First Resume
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => (
                <div key={resume._id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{resume.title}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        resume.template === 'professional' ? 'bg-blue-600' :
                        resume.template === 'creative' ? 'bg-purple-600' : 'bg-green-600'
                      } text-white`}>
                        {resume.template}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => downloadResume(resume)}
                        className="text-gray-400 hover:text-white p-1"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/resume-builder?id=${resume._id}`}
                        className="text-gray-400 hover:text-white p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => deleteResume(resume._id)}
                        className="text-gray-400 hover:text-red-400 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Updated {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {resume.experience?.length || 0} experience{resume.experience?.length !== 1 ? 's' : ''}, {resume.skills?.length || 0} skill{resume.skills?.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
