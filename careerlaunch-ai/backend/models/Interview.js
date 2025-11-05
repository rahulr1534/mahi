const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true
  },
  jobDescription: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused'],
    default: 'active'
  },
  questions: [{
    question: String,
    type: {
      type: String,
      enum: ['technical', 'behavioral', 'situational']
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard']
    },
    topic: String,
    order: Number
  }],
  responses: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: String,
    responseTime: Number, // in seconds
    feedback: {
      score: {
        type: Number,
        min: 0,
        max: 10
      },
      strengths: [String],
      improvements: [String],
      relevance: {
        type: Number,
        min: 0,
        max: 10
      },
      clarity: {
        type: Number,
        min: 0,
        max: 10
      },
      completeness: {
        type: Number,
        min: 0,
        max: 10
      },
      comments: String
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  currentQuestionIndex: {
    type: Number,
    default: 0
  },
  totalScore: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  duration: Number, // total duration in minutes
  settings: {
    timeLimit: {
      type: Number, // minutes per question, 0 = no limit
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 10
    },
    includeTechnical: {
      type: Boolean,
      default: true
    },
    includeBehavioral: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Calculate average score before saving
InterviewSchema.pre('save', function(next) {
  if (this.responses && this.responses.length > 0) {
    const scores = this.responses
      .filter(r => r.feedback && r.feedback.score)
      .map(r => r.feedback.score);

    if (scores.length > 0) {
      this.totalScore = scores.reduce((sum, score) => sum + score, 0);
      this.averageScore = this.totalScore / scores.length;
    }
  }
  next();
});

module.exports = mongoose.model('Interview', InterviewSchema);
