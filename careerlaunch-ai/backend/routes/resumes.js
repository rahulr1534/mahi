const express = require('express');
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Generate AI resume content using OpenAI
router.post('/generate', auth, async (req, res) => {
  try {
    const { prompt, template, experience, skills, education, targetRole } = req.body;

    // Check if OpenAI is available
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Fallback to mock generation
      return res.json(generateMockResumeContent(experience, skills, education, targetRole));
    }

    // Generate professional summary
    const summaryPrompt = `Write a compelling professional summary for a resume. The person has the following experience:

Experience: ${experience?.map(exp => `${exp.position} at ${exp.company} - ${exp.description}`).join('\n') || 'No experience provided'}

Skills: ${skills?.join(', ') || 'No skills provided'}

Education: ${education?.map(edu => `${edu.degree} in ${edu.field} from ${edu.institution}`).join('\n') || 'No education provided'}

Target Role: ${targetRole || 'General professional role'}

Write a 3-4 sentence professional summary that highlights their key strengths, experience, and career goals. Make it engaging and tailored to the target role.`;

    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional resume writer helping create compelling summaries." },
        { role: "user", content: summaryPrompt }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    const generatedSummary = summaryCompletion.choices[0].message.content.trim();

    // Generate additional skills if needed
    let enhancedSkills = skills || [];
    if (enhancedSkills.length < 5) {
      const skillsPrompt = `Based on this professional experience, suggest 5-8 relevant technical and soft skills:

Experience: ${experience?.map(exp => `${exp.position} at ${exp.company}`).join(', ') || 'General experience'}

Current skills: ${skills?.join(', ') || 'None listed'}

Return only a comma-separated list of skills.`;

      const skillsCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a career advisor suggesting relevant skills for resumes." },
          { role: "user", content: skillsPrompt }
        ],
        max_tokens: 100,
        temperature: 0.6
      });

      const newSkills = skillsCompletion.choices[0].message.content.trim().split(',').map(s => s.trim());
      enhancedSkills = [...new Set([...enhancedSkills, ...newSkills])].slice(0, 10);
    }

    res.json({
      summary: generatedSummary,
      skills: enhancedSkills,
      suggestions: "I've generated a professional summary based on your experience. Feel free to edit it to better reflect your unique voice and achievements!"
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback to mock generation
    res.json(generateMockResumeContent(experience, skills, education, targetRole));
  }
});

// Fallback mock generation
function generateMockResumeContent(experience, skills, education, targetRole) {
  const mockSummaries = [
    "Dynamic and results-oriented professional with extensive experience in software development and team leadership. Proven track record of delivering high-quality solutions and driving innovation in fast-paced environments.",
    "Experienced developer passionate about creating user-centric applications and solving complex technical challenges. Strong background in full-stack development with expertise in modern technologies.",
    "Accomplished professional with a proven ability to lead cross-functional teams and deliver successful projects. Skilled in strategic planning, problem-solving, and fostering collaborative work environments.",
    "Innovative technology leader with deep expertise in software engineering and system architecture. Committed to continuous learning and staying at the forefront of industry trends and best practices."
  ];

  const mockSkills = [
    "JavaScript", "React", "Node.js", "Python", "SQL", "Git",
    "Team Leadership", "Problem Solving", "Communication", "Agile"
  ];

  return {
    summary: mockSummaries[Math.floor(Math.random() * mockSummaries.length)],
    skills: mockSkills.slice(0, 8),
    suggestions: "This is a sample professional summary. Consider customizing it with your specific achievements and career goals."
  };
}

module.exports = router;
