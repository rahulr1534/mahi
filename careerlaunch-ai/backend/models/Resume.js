const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  template: {
    type: String,
    enum: ['professional', 'creative', 'minimalist'],
    default: 'professional'
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    linkedin: String,
    website: String
  },
  summary: {
    type: String,
    trim: true
  },
  experience: [{
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    startDate: Date,
    endDate: Date,
    gpa: String
  }],
  skills: [String],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    credentialId: String
  }],
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'native']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
resumeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Resume', resumeSchema);
