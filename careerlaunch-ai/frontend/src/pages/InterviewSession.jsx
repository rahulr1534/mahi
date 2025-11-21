import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, Send, Pause, Play, SkipForward, MessageSquare, Target, CheckCircle, XCircle } from 'lucide-react';

const InterviewSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !isPaused) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && currentQuestion && interview?.settings?.timeLimit > 0) {
      handleSubmitAnswer();
    }
  }, [timeLeft, isPaused]);

  const fetchInterview = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/interviews/${id}`);
      setInterview(response.data);

      // Find the current question
      const currentQ = response.data.questions[response.data.currentQuestionIndex];
      if (currentQ) {
        setCurrentQuestion(currentQ);
        if (response.data.settings?.timeLimit > 0) {
          setTimeLeft(response.data.settings.timeLimit * 60); // Convert to seconds
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch interview:', error);
      navigate('/mock-interview');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;

    setSubmitting(true);
    try {
      const response = await axios.post(`http://localhost:5000/api/interviews/${id}/answer`, {
        questionId: currentQuestion._id,
        answer: answer.trim(),
        responseTime: interview.settings?.timeLimit > 0 ? (interview.settings.timeLimit * 60 - timeLeft) : 0
      });

      setFeedback(response.data.feedback);

      if (response.data.completed) {
        // Interview completed
        setTimeout(() => {
          navigate(`/interview/${id}/results`);
        }, 3000);
      } else {
        // Move to next question
        setTimeout(() => {
          fetchInterview(); // Refresh to get next question
          setAnswer('');
          setFeedback(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePause = async () => {
    try {
      await axios.post(`http://localhost:5000/api/interviews/${id}/pause`);
      setIsPaused(true);
    } catch (error) {
      console.error('Failed to pause interview:', error);
    }
  };

  const handleResume = async () => {
    try {
      await axios.post(`http://localhost:5000/api/interviews/${id}/resume`);
      setIsPaused(false);
    } catch (error) {
      console.error('Failed to resume interview:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!interview || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Interview Completed!</h2>
          <button
            onClick={() => navigate(`/interview/${id}/results`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  const progress = ((interview.currentQuestionIndex + 1) / interview.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Mock Interview</h1>
            <p className="text-gray-400">{interview.jobRole} Interview</p>
          </div>
          <div className="flex gap-2">
            {isPaused ? (
              <button
                onClick={handleResume}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                <Play className="h-4 w-4" />
                Resume
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-700 rounded-full h-3 mb-4">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Question {interview.currentQuestionIndex + 1} of {interview.questions.length}</span>
          <div className="flex items-center gap-4">
            {interview.averageScore && (
              <span className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Avg Score: {interview.averageScore.toFixed(1)}/10
              </span>
            )}
            {timeLeft > 0 && (
              <span className={`flex items-center ${timeLeft < 60 ? 'text-red-400' : 'text-gray-400'}`}>
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
        <div className="flex items-start gap-4 mb-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentQuestion.type === 'technical' ? 'bg-blue-600' :
            currentQuestion.type === 'behavioral' ? 'bg-green-600' : 'bg-purple-600'
          } text-white`}>
            {currentQuestion.type}
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            currentQuestion.difficulty === 'easy' ? 'bg-green-500' :
            currentQuestion.difficulty === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
          } text-white`}>
            {currentQuestion.difficulty}
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-4">{currentQuestion.question}</h2>

        {currentQuestion.topic && (
          <p className="text-gray-400 text-sm mb-4">Topic: {currentQuestion.topic}</p>
        )}
      </div>

      {/* Answer Input */}
      {!feedback ? (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Your Answer
          </label>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            rows={8}
            placeholder="Type your answer here..."
            disabled={isPaused || submitting}
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-400 text-sm">
              {answer.length} characters
            </p>
            <button
              onClick={handleSubmitAnswer}
              disabled={!answer.trim() || submitting || isPaused}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </button>
          </div>
        </div>
      ) : (
        /* Chat-like Feedback Display */
        <div className="mb-6">
          {/* AI Interviewer Chat Bubble */}
          <div className="flex gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gray-800 rounded-2xl rounded-tl-md px-4 py-3 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-400 font-semibold text-sm">AI Interviewer</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    feedback.score >= 8 ? 'bg-green-600' :
                    feedback.score >= 6 ? 'bg-yellow-600' : 'bg-red-600'
                  } text-white`}>
                    {feedback.score}/10
                  </span>
                </div>

                <div className="text-gray-300 leading-relaxed">
                  {feedback.comments || "Thanks for your response! Let's continue with the next question."}
                </div>

                {/* Quick feedback points */}
                {(feedback.strengths?.length > 0 || feedback.improvements?.length > 0) && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    {feedback.strengths?.length > 0 && (
                      <div className="mb-2">
                        <span className="text-green-400 text-sm font-medium">✓ What you did well:</span>
                        <ul className="text-gray-300 text-sm mt-1 space-y-1">
                          {feedback.strengths.slice(0, 2).map((strength, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {feedback.improvements?.length > 0 && (
                      <div>
                        <span className="text-yellow-400 text-sm font-medium">💡 Suggestions for improvement:</span>
                        <ul className="text-gray-300 text-sm mt-1 space-y-1">
                          {feedback.improvements.slice(0, 2).map((improvement, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-yellow-400 mr-2">•</span>
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="text-center text-gray-400 text-sm">
            {interview.status === 'completed'
              ? '🎉 Interview completed! Redirecting to results...'
              : '⏳ Preparing next question...'
            }
          </div>
        </div>
      )}

      {/* Interview Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
          <div className="text-2xl font-bold text-blue-400">{interview.responses?.length || 0}</div>
          <div className="text-gray-400 text-sm">Questions Answered</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
          <div className="text-2xl font-bold text-green-400">
            {interview.responses?.length ? (interview.totalScore / interview.responses.length).toFixed(1) : '0.0'}
          </div>
          <div className="text-gray-400 text-sm">Average Score</div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.floor((Date.now() - new Date(interview.startTime)) / (1000 * 60))}
          </div>
          <div className="text-gray-400 text-sm">Minutes Elapsed</div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
