import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Play, Pause, RotateCcw, BarChart3, Clock, Target } from 'lucide-react';

const MockInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/interviews');
      setInterviews(response.data);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteInterview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this interview?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/interviews/${id}`);
      setInterviews(interviews.filter(interview => interview._id !== id));
    } catch (error) {
      console.error('Failed to delete interview:', error);
    }
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
        <h1 className="text-3xl font-bold text-white mb-2">Mock Interviews</h1>
        <p className="text-gray-400">Practice interviews with AI-powered feedback and scoring</p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div
          onClick={() => setShowSetup(true)}
          className="bg-gray-800 hover:bg-gray-700 p-6 rounded-lg border border-gray-700 transition duration-300 cursor-pointer"
        >
          <div className="flex items-center mb-4">
            <Play className="h-8 w-8 text-green-500 mr-3" />
            <h3 className="text-xl font-semibold text-white">Start New Interview</h3>
          </div>
          <p className="text-gray-400">Begin a new mock interview session with AI feedback</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-8 w-8 text-purple-500 mr-3" />
            <h3 className="text-xl font-semibold text-white">Interview Analytics</h3>
          </div>
          <p className="text-gray-400">Track your progress and performance over time</p>
        </div>
      </div>

      {/* Interview History */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Interview History</h2>
        </div>

        <div className="p-6">
          {interviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No interviews yet</h3>
              <p className="text-gray-400 mb-6">Start your first mock interview to begin practicing</p>
              <button
                onClick={() => setShowSetup(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
              >
                Start Your First Interview
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview._id} className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{interview.jobRole}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className={`px-2 py-1 rounded text-xs ${
                          interview.status === 'completed' ? 'bg-green-600' :
                          interview.status === 'active' ? 'bg-blue-600' : 'bg-yellow-600'
                        } text-white`}>
                          {interview.status}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {interview.duration ? `${interview.duration} min` : 'In progress'}
                        </span>
                        {interview.averageScore && (
                          <span className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            {interview.averageScore.toFixed(1)}/10
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {interview.status === 'active' && (
                        <Link
                          to={`/interview/${interview._id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                          Continue
                        </Link>
                      )}
                      {interview.status === 'paused' && (
                        <Link
                          to={`/interview/${interview._id}`}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                          Resume
                        </Link>
                      )}
                      {interview.status === 'completed' && (
                        <Link
                          to={`/interview/${interview._id}/results`}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm font-medium"
                        >
                          View Results
                        </Link>
                      )}
                      <button
                        onClick={() => deleteInterview(interview._id)}
                        className="text-gray-400 hover:text-red-400 p-2"
                        title="Delete Interview"
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 text-sm">
                    Started {new Date(interview.createdAt).toLocaleDateString()}
                    {interview.endTime && ` • Completed ${new Date(interview.endTime).toLocaleDateString()}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Interview Setup Modal */}
      {showSetup && (
        <InterviewSetup onClose={() => setShowSetup(false)} onStart={fetchInterviews} />
      )}
    </div>
  );
};

// Interview Setup Component
const InterviewSetup = ({ onClose, onStart }) => {
  const [formData, setFormData] = useState({
    jobRole: '',
    jobDescription: '',
    settings: {
      totalQuestions: 10,
      timeLimit: 0,
      includeTechnical: true,
      includeBehavioral: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [customRole, setCustomRole] = useState('');
  const [useCustomRole, setUseCustomRole] = useState(false);

  const predefinedRoles = [
    'Software Engineer',
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Data Scientist',
    'Data Analyst',
    'Product Manager',
    'DevOps Engineer',
    'UI/UX Designer',
    'Mobile App Developer',
    'Security Engineer',
    'QA Engineer',
    'System Administrator',
    'Database Administrator',
    'Cloud Architect',
    'Machine Learning Engineer',
    'Technical Writer',
    'Project Manager',
    'Business Analyst',
    'Network Engineer',
    'Scrum Master',
    'Marketing Manager',
    'Sales Engineer',
    'HR Manager',
    'Financial Analyst'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Use custom role if specified, otherwise use selected role
    const finalJobRole = useCustomRole ? customRole : formData.jobRole;

    if (!finalJobRole.trim()) {
      alert('Please select or enter a job role');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/interviews/create', {
        ...formData,
        jobRole: finalJobRole
      });
      onStart();
      onClose();
      // Redirect to the new interview
      // This would be handled by the parent component
    } catch (error) {
      console.error('Failed to create interview:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">Setup Mock Interview</h2>
          <p className="text-gray-400">Configure your interview session</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Job Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Role
            </label>

            {/* Toggle between predefined and custom */}
            <div className="flex items-center gap-4 mb-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="roleType"
                  checked={!useCustomRole}
                  onChange={() => setUseCustomRole(false)}
                  className="mr-2"
                />
                <span className="text-gray-300 text-sm">Select from list</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="roleType"
                  checked={useCustomRole}
                  onChange={() => setUseCustomRole(true)}
                  className="mr-2"
                />
                <span className="text-gray-300 text-sm">Enter custom role</span>
              </label>
            </div>

            {!useCustomRole ? (
              <select
                value={formData.jobRole}
                onChange={(e) => setFormData({ ...formData, jobRole: e.target.value })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!useCustomRole}
              >
                <option value="">Select a job role...</option>
                {predefinedRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Python Developer, Marketing Specialist, etc."
                required={useCustomRole}
              />
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description (Optional)
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Paste the job description here for more tailored questions..."
            />
          </div>

          {/* Interview Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Interview Settings</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Number of Questions
                </label>
                <select
                  value={formData.settings.totalQuestions}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, totalQuestions: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                  <option value={20}>20 Questions</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Time Limit per Question
                </label>
                <select
                  value={formData.settings.timeLimit}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, timeLimit: parseInt(e.target.value) }
                  })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>No time limit</option>
                  <option value={1}>1 minute</option>
                  <option value={2}>2 minutes</option>
                  <option value={3}>3 minutes</option>
                  <option value={5}>5 minutes</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.settings.includeTechnical}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, includeTechnical: e.target.checked }
                  })}
                  className="mr-2"
                />
                <span className="text-gray-300">Include Technical Questions</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.settings.includeBehavioral}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, includeBehavioral: e.target.checked }
                  })}
                  className="mr-2"
                />
                <span className="text-gray-300">Include Behavioral Questions</span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Start Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MockInterview;
