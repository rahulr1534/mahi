import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Target, Clock, TrendingUp, Award, MessageSquare, CheckCircle, XCircle, BarChart3 } from 'lucide-react';

const InterviewResults = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviewResults();
  }, [id]);

  const fetchInterviewResults = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/interviews/${id}`);
      setInterview(response.data);
    } catch (error) {
      console.error('Failed to fetch interview results:', error);
      navigate('/mock-interview');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Results not found</h2>
          <button
            onClick={() => navigate('/mock-interview')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Back to Interviews
          </button>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };



  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/mock-interview')}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Interviews
        </button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Results</h1>
            <p className="text-gray-400">{interview.jobRole} Interview</p>
            <p className="text-gray-500 text-sm">
              Completed on {new Date(interview.endTime || interview.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <div className={`text-4xl font-bold ${getScoreColor(interview.averageScore)}`}>
              {interview.averageScore.toFixed(1)}/10
            </div>
            <div className="text-gray-400 text-sm">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{interview.questions.length}</div>
          <div className="text-gray-400 text-sm">Total Questions</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{interview.responses.length}</div>
          <div className="text-gray-400 text-sm">Questions Answered</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-white">{interview.duration || Math.floor((new Date(interview.endTime) - new Date(interview.startTime)) / (1000 * 60))}</div>
          <div className="text-gray-400 text-sm">Minutes Taken</div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <div className={`text-2xl font-bold ${getScoreColor(interview.averageScore)}`}>
            {interview.averageScore.toFixed(1)}
          </div>
          <div className="text-gray-400 text-sm">Average Score</div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Score Breakdown</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {interview.responses.length > 0 && (
            <>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {(interview.responses.reduce((sum, r) => sum + (r.feedback?.relevance || 0), 0) / interview.responses.length).toFixed(1)}/10
                </div>
                <div className="text-gray-400 text-sm">Average Relevance</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {(interview.responses.reduce((sum, r) => sum + (r.feedback?.clarity || 0), 0) / interview.responses.length).toFixed(1)}/10
                </div>
                <div className="text-gray-400 text-sm">Average Clarity</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {(interview.responses.reduce((sum, r) => sum + (r.feedback?.completeness || 0), 0) / interview.responses.length).toFixed(1)}/10
                </div>
                <div className="text-gray-400 text-sm">Average Completeness</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Question-by-Question Analysis */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Question Analysis</h2>
        </div>

        <div className="divide-y divide-gray-700">
          {interview.questions.map((question, index) => {
            const response = interview.responses.find(r => r.questionId === question._id.toString());
            const feedback = response?.feedback;

            return (
              <div key={question._id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        question.type === 'technical' ? 'bg-blue-600' :
                        question.type === 'behavioral' ? 'bg-green-600' : 'bg-purple-600'
                      } text-white`}>
                        {question.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        question.difficulty === 'easy' ? 'bg-green-500' :
                        question.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        {question.difficulty}
                      </span>
                      <span className="text-gray-400 text-sm">Q{index + 1}</span>
                    </div>

                    <h3 className="text-white font-medium mb-2">{question.question}</h3>

                    {question.topic && (
                      <p className="text-gray-400 text-sm mb-3">Topic: {question.topic}</p>
                    )}

                    {response && (
                      <div className="bg-gray-700 rounded p-3 mb-3">
                        <p className="text-gray-300 text-sm italic">"{response.answer}"</p>
                      </div>
                    )}
                  </div>

                  {feedback && (
                    <div className="ml-6 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(feedback.score)}`}>
                        {feedback.score}/10
                      </div>
                      <div className="text-gray-400 text-sm">Score</div>
                    </div>
                  )}
                </div>

                {feedback && (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Strengths */}
                    {feedback.strengths && feedback.strengths.length > 0 && (
                      <div>
                        <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Strengths
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {feedback.strengths.map((strength, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {feedback.improvements && feedback.improvements.length > 0 && (
                      <div>
                        <h4 className="text-yellow-400 font-semibold mb-2 flex items-center">
                          <XCircle className="h-4 w-4 mr-1" />
                          Areas for Improvement
                        </h4>
                        <ul className="text-gray-300 text-sm space-y-1">
                          {feedback.improvements.map((improvement, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {feedback?.comments && (
                  <div className="mt-4 p-3 bg-gray-700 rounded">
                    <h4 className="text-blue-400 font-semibold mb-1">AI Comments</h4>
                    <p className="text-gray-300 text-sm">{feedback.comments}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Question Type Performance */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Performance by Question Type</h3>

          {(() => {
            const technicalResponses = interview.responses.filter(r =>
              interview.questions.find(q => q._id.toString() === r.questionId)?.type === 'technical'
            );
            const behavioralResponses = interview.responses.filter(r =>
              interview.questions.find(q => q._id.toString() === r.questionId)?.type === 'behavioral'
            );

            const technicalAvg = technicalResponses.length > 0
              ? technicalResponses.reduce((sum, r) => sum + (r.feedback?.score || 0), 0) / technicalResponses.length
              : 0;
            const behavioralAvg = behavioralResponses.length > 0
              ? behavioralResponses.reduce((sum, r) => sum + (r.feedback?.score || 0), 0) / behavioralResponses.length
              : 0;

            return (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Technical Questions</span>
                  <span className={`font-semibold ${getScoreColor(technicalAvg)}`}>
                    {technicalAvg.toFixed(1)}/10
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Behavioral Questions</span>
                  <span className={`font-semibold ${getScoreColor(behavioralAvg)}`}>
                    {behavioralAvg.toFixed(1)}/10
                  </span>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Recommendations */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recommendations</h3>

          <div className="space-y-3 text-sm text-gray-300">
            {interview.averageScore >= 8 && (
              <p className="text-green-400">
                🎉 Excellent performance! You're well-prepared for {interview.jobRole} interviews.
              </p>
            )}

            {interview.averageScore >= 6 && interview.averageScore < 8 && (
              <p className="text-yellow-400">
                📈 Good progress! Focus on the improvement areas highlighted above.
              </p>
            )}

            {interview.averageScore < 6 && (
              <p className="text-red-400">
                📚 Consider more practice and review the feedback for each question.
              </p>
            )}

            <p>• Practice similar interviews regularly to improve confidence</p>
            <p>• Review technical concepts and behavioral examples</p>
            <p>• Record yourself answering questions to improve delivery</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => navigate('/mock-interview')}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Back to Interviews
        </button>
        <button
          onClick={() => navigate('/mock-interview')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewResults;
