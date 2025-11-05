import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Briefcase, Sparkles, CheckCircle } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-purple-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Build Your Career with
            <span className="text-blue-400"> AI-Powered</span> Resumes
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Create professional resumes in minutes with our AI assistant. Choose from modern templates,
            get personalized suggestions, and land your dream job faster.
          </p>
          <div className="flex justify-center space-x-4">
            {isAuthenticated ? (
              <Link
                to="/resume-builder"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
              >
                Start Building
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Why Choose CareerLaunch AI?</h2>
            <p className="text-gray-400 text-lg">Everything you need to create standout resumes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Content</h3>
              <p className="text-gray-400">
                Our AI analyzes your experience and suggests optimized content for better results.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <FileText className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Modern Templates</h3>
              <p className="text-gray-400">
                Choose from professional, creative, and minimalist templates designed for success.
              </p>
            </div>

            <div className="bg-gray-700 p-6 rounded-lg text-center">
              <Briefcase className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Job Matching</h3>
              <p className="text-gray-400">
                Find relevant job opportunities based on your resume skills and experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Preview */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Professional Templates</h2>
            <p className="text-gray-400 text-lg">Choose the perfect design for your career</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="bg-blue-600 h-32 rounded mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">Professional</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Professional Template</h3>
              <p className="text-gray-400 text-sm mb-4">
                Clean, traditional design perfect for corporate positions and formal industries.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="bg-blue-600 text-xs px-2 py-1 rounded">Corporate</span>
                <span className="bg-blue-600 text-xs px-2 py-1 rounded">Finance</span>
                <span className="bg-blue-600 text-xs px-2 py-1 rounded">Legal</span>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="bg-purple-600 h-32 rounded mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">Creative</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Creative Template</h3>
              <p className="text-gray-400 text-sm mb-4">
                Eye-catching design for creative fields like marketing, design, and tech.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="bg-purple-600 text-xs px-2 py-1 rounded">Design</span>
                <span className="bg-purple-600 text-xs px-2 py-1 rounded">Marketing</span>
                <span className="bg-purple-600 text-xs px-2 py-1 rounded">Tech</span>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="bg-green-600 h-32 rounded mb-4 flex items-center justify-center">
                <span className="text-white font-semibold">Minimalist</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Minimalist Template</h3>
              <p className="text-gray-400 text-sm mb-4">
                Simple, clean design that focuses on content and readability.
              </p>
              <div className="flex flex-wrap gap-1">
                <span className="bg-green-600 text-xs px-2 py-1 rounded">Simple</span>
                <span className="bg-green-600 text-xs px-2 py-1 rounded">Modern</span>
                <span className="bg-green-600 text-xs px-2 py-1 rounded">Clean</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Launch Your Career?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals who have landed their dream jobs with CareerLaunch AI.
          </p>
          <Link
            to={isAuthenticated ? "/resume-builder" : "/signup"}
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300"
          >
            {isAuthenticated ? "Create Resume" : "Start Free Trial"}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
