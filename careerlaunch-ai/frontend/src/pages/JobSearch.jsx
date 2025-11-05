import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, MapPin, DollarSign, Calendar, ExternalLink, Sparkles, Target } from 'lucide-react';

const JobSearch = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useState({
    skills: '',
    location: '',
    keywords: ''
  });
  const [userResumes, setUserResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [showResumeSelector, setShowResumeSelector] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async (params = {}) => {
    try {
      setLoading(true);
      setError('');
      const queryString = new URLSearchParams(params).toString();
      const response = await axios.get(`http://localhost:5000/api/jobs/search?${queryString}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Job search error:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchParams);
  };

  const handleInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const getPlatformName = (url) => {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      if (domain.includes('linkedin')) return 'LinkedIn';
      if (domain.includes('indeed')) return 'Indeed';
      if (domain.includes('glassdoor')) return 'Glassdoor';
      if (domain.includes('monster')) return 'Monster';
      if (domain.includes('netflix')) return 'Netflix';
      if (domain.includes('spotify')) return 'Spotify';
      return 'External Site';
    } catch {
      return 'External Site';
    }
  };

  const fetchUserResumes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/resumes');
      setUserResumes(response.data);
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
    }
  };

  const handleAIPersonalizedSearch = async () => {
    if (!selectedResume) {
      setError('Please select a resume for personalized recommendations');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`http://localhost:5000/api/jobs/search?resumeId=${selectedResume}`);
      setJobs(response.data);
      setShowResumeSelector(false);
    } catch (error) {
      console.error('AI job search error:', error);
      setError('Failed to get personalized job recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openResumeSelector = () => {
    fetchUserResumes();
    setShowResumeSelector(true);
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
        <h1 className="text-3xl font-bold text-white mb-2">Job Search</h1>
        <p className="text-gray-400">Find job opportunities that match your resume skills</p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Search Form */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Skills
              </label>
              <input
                type="text"
                name="skills"
                value={searchParams.skills}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., React, JavaScript, Python"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={searchParams.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., New York, Remote"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Keywords
              </label>
              <input
                type="text"
                name="keywords"
                value={searchParams.keywords}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Frontend, Developer"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center justify-center"
            >
              <Search className="h-4 w-4 mr-2" />
              Search Jobs
            </button>

            <button
              type="button"
              onClick={openResumeSelector}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md font-medium flex items-center justify-center"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Recommendations
            </button>
          </div>
        </form>
      </div>

      {/* Resume Selector Modal */}
      {showResumeSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <Target className="h-6 w-6 text-purple-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">AI Job Recommendations</h3>
            </div>

            <p className="text-gray-300 mb-4">
              Select a resume to get personalized job recommendations based on your skills, experience, and career goals.
            </p>

            {userResumes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-4">No resumes found. Create a resume first to get AI recommendations.</p>
                <button
                  onClick={() => window.location.href = '/resume-builder'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Create Resume
                </button>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {userResumes.map((resume) => (
                  <div
                    key={resume._id}
                    onClick={() => setSelectedResume(resume._id)}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedResume === resume._id
                        ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        checked={selectedResume === resume._id}
                        onChange={() => setSelectedResume(resume._id)}
                        className="mr-3"
                      />
                      <div>
                        <h4 className="text-white font-medium">{resume.title || 'Untitled Resume'}</h4>
                        <p className="text-gray-400 text-sm">
                          Created: {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowResumeSelector(false)}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
              >
                Cancel
              </button>
              {userResumes.length > 0 && (
                <button
                  onClick={handleAIPersonalizedSearch}
                  disabled={!selectedResume}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Get AI Recommendations
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Job Listings */}
      <div className="space-y-6">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sorry, no jobs found for that search.</h3>
            <div className="text-gray-400 mb-6">
              <p className="mb-2">Search Suggestions:</p>
              <ul className="text-sm space-y-1">
                <li>• Check your keyword and location above</li>
                <li>• Increase your search radius in filters</li>
                <li>• Try removing filters to find additional jobs</li>
                <li>• Try common skills like: React, Python, JavaScript, Java</li>
              </ul>
            </div>
            <button
              onClick={() => fetchJobs({})}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Show All Jobs
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">{job.title}</h3>
                  <p className="text-gray-400 text-lg mb-2">{job.company}</p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 line-clamp-3">{job.description}</p>

                  {/* Match Score and Reasons (for AI recommendations) */}
                  {job.matchScore && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-purple-900 to-pink-900 rounded-md border border-purple-700">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
                          <span className="text-purple-300 font-medium">AI Match Score</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{job.matchScore}%</div>
                      </div>
                      {job.matchReasons && job.matchReasons.length > 0 && (
                        <div className="text-sm text-purple-200">
                          <div className="font-medium mb-1">Why this matches:</div>
                          <ul className="space-y-1">
                            {job.matchReasons.map((reason, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-purple-400 mr-2">•</span>
                                {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="text-gray-400 text-xs px-2 py-1">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center transition duration-200"
                  >
                    Apply Now
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </a>
                  <div className="text-xs text-gray-500 text-center">
                    via {getPlatformName(job.applyUrl)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobSearch;
