const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all resumes for user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new resume
router.post('/', auth, async (req, res) => {
  try {
    const resume = new Resume({
      ...req.body,
      user: req.user._id
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update resume
router.put('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json({ message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate AI resume content
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, template } = req.body;

    // This is a placeholder for AI integration
    // In a real implementation, you would call an AI service like OpenAI
    const generatedContent = {
      summary: "Generated professional summary based on your experience.",
      skills: ["JavaScript", "React", "Node.js", "Python"],
      experience: [{
        company: "Tech Company",
        position: "Software Developer",
        description: "Developed web applications using modern technologies."
      }]
    };

    res.json(generatedContent);
  } catch (error) {
    res.status(500).json({ message: 'AI generation failed' });
  }
});

module.exports = router;
