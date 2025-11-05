const express = require('express');
const Interview = require('../models/Interview');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new interview session
router.post('/create', auth, async (req, res) => {
  try {
    const { jobRole, jobDescription, settings } = req.body;

    // Generate questions based on job role and description
    const questions = await generateInterviewQuestions(jobRole, jobDescription, settings);

    const interview = new Interview({
      user: req.user.id,
      jobRole,
      jobDescription,
      questions,
      settings: {
        timeLimit: settings?.timeLimit || 0,
        totalQuestions: settings?.totalQuestions || 10,
        includeTechnical: settings?.includeTechnical !== false,
        includeBehavioral: settings?.includeBehavioral !== false
      }
    });

    await interview.save();
    res.json(interview);
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ message: 'Failed to create interview' });
  }
});

// Get user's interview sessions
router.get('/', auth, async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('jobRole status averageScore duration createdAt endTime');

    res.json(interviews);
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Failed to fetch interviews' });
  }
});

// Get specific interview
router.get('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Failed to fetch interview' });
  }
});

// Submit answer and get AI feedback
router.post('/:id/answer', auth, async (req, res) => {
  try {
    const { questionId, answer, responseTime } = req.body;

    const interview = await Interview.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Get AI feedback for the answer
    const feedback = await generateAIFeedback(
      interview.questions.find(q => q._id.toString() === questionId),
      answer,
      interview.jobRole
    );

    // Add response to interview
    interview.responses.push({
      questionId,
      answer,
      responseTime,
      feedback
    });

    // Update current question index
    const questionIndex = interview.questions.findIndex(q => q._id.toString() === questionId);
    if (questionIndex >= 0) {
      interview.currentQuestionIndex = questionIndex + 1;
    }

    // Check if interview is complete
    if (interview.currentQuestionIndex >= interview.questions.length) {
      interview.status = 'completed';
      interview.endTime = new Date();
      interview.duration = Math.round((interview.endTime - interview.startTime) / (1000 * 60)); // minutes
    }

    await interview.save();
    res.json({ feedback, completed: interview.status === 'completed' });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ message: 'Failed to submit answer' });
  }
});

// Pause interview
router.post('/:id/pause', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'paused' },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    console.error('Pause interview error:', error);
    res.status(500).json({ message: 'Failed to pause interview' });
  }
});

// Resume interview
router.post('/:id/resume', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status: 'active' },
      { new: true }
    );

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json(interview);
  } catch (error) {
    console.error('Resume interview error:', error);
    res.status(500).json({ message: 'Failed to resume interview' });
  }
});

// Delete interview
router.delete('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Failed to delete interview' });
  }
});

// Generate interview questions (mock implementation - in production, use AI)
async function generateInterviewQuestions(jobRole, jobDescription, settings) {
  const questions = [];
  const totalQuestions = settings?.totalQuestions || 10;
  const includeTechnical = settings?.includeTechnical !== false;
  const includeBehavioral = settings?.includeBehavioral !== false;

  // Predefined question templates based on job role
  const questionTemplates = {
    'Software Engineer': {
      technical: [
        "Explain the difference between REST and GraphQL APIs.",
        "How would you optimize a slow database query?",
        "Describe your experience with version control systems.",
        "How do you handle state management in a React application?",
        "Explain the concept of microservices architecture.",
        "How would you approach debugging a memory leak?",
        "Describe the difference between SQL and NoSQL databases.",
        "How do you ensure code quality and prevent bugs?"
      ],
      behavioral: [
        "Tell me about a challenging project you worked on and how you overcame obstacles.",
        "How do you handle tight deadlines and competing priorities?",
        "Describe a time when you received constructive criticism and how you responded.",
        "How do you approach learning new technologies?",
        "Tell me about a time you had to work with a difficult team member.",
        "How do you prioritize tasks when working on multiple projects?",
        "Describe your approach to code reviews.",
        "How do you stay updated with industry trends?"
      ]
    },
    'Frontend Developer': {
      technical: [
        "How do you optimize React application performance?",
        "Explain the virtual DOM and how it works.",
        "How would you implement responsive design?",
        "Describe your experience with state management libraries.",
        "How do you handle cross-browser compatibility issues?",
        "Explain CSS Grid vs Flexbox.",
        "How do you approach testing React components?",
        "Describe your experience with build tools and bundlers."
      ],
      behavioral: [
        "How do you ensure your code is accessible?",
        "Tell me about a UI/UX challenge you faced.",
        "How do you collaborate with designers?",
        "Describe your approach to user feedback.",
        "How do you handle browser compatibility issues?",
        "Tell me about a time you improved user experience.",
        "How do you stay updated with frontend trends?",
        "Describe your debugging process for UI issues."
      ]
    },
    'Backend Developer': {
      technical: [
        "How do you design scalable APIs?",
        "Explain database indexing and when to use it.",
        "How do you handle database migrations?",
        "Describe your experience with caching strategies.",
        "How do you approach API security?",
        "Explain the differences between monolithic and microservices architecture.",
        "How do you handle database transactions?",
        "Describe your experience with message queues."
      ],
      behavioral: [
        "How do you ensure API reliability and uptime?",
        "Tell me about a performance optimization you implemented.",
        "How do you handle database schema changes?",
        "Describe your approach to code documentation.",
        "How do you collaborate with frontend developers?",
        "Tell me about a time you dealt with a production issue.",
        "How do you approach technical debt?",
        "Describe your monitoring and logging practices."
      ]
    },
    'Full Stack Developer': {
      technical: [
        "How do you approach full-stack architecture design?",
        "Explain your experience with both frontend and backend technologies.",
        "How do you handle data flow between frontend and backend?",
        "Describe your deployment and CI/CD experience.",
        "How do you ensure security across the full stack?",
        "Explain your approach to API design and documentation.",
        "How do you handle state synchronization in full-stack apps?",
        "Describe your experience with cloud platforms and services."
      ],
      behavioral: [
        "How do you coordinate between frontend and backend teams?",
        "Tell me about a full-stack project you led.",
        "How do you balance frontend and backend priorities?",
        "Describe your approach to end-to-end testing.",
        "How do you handle cross-team communication?",
        "Tell me about a time you optimized a full-stack application.",
        "How do you stay current with both frontend and backend technologies?",
        "Describe your experience with agile development in full-stack projects."
      ]
    },
    'Data Scientist': {
      technical: [
        "Explain the bias-variance tradeoff in machine learning.",
        "How do you handle missing data in a dataset?",
        "Describe your experience with feature engineering.",
        "How do you evaluate model performance?",
        "Explain overfitting and how to prevent it.",
        "How do you approach A/B testing?",
        "Describe your experience with data visualization.",
        "How do you handle imbalanced datasets?"
      ],
      behavioral: [
        "How do you communicate technical findings to non-technical stakeholders?",
        "Tell me about a time you had to clean messy data.",
        "How do you validate your model's assumptions?",
        "Describe your approach to exploratory data analysis.",
        "How do you stay updated with ML research?",
        "Tell me about a model deployment challenge you faced.",
        "How do you ensure model fairness and ethics?",
        "Describe your experience with cross-functional collaboration."
      ]
    },
    'Data Analyst': {
      technical: [
        "How do you approach data cleaning and preprocessing?",
        "Explain your experience with SQL and database querying.",
        "How do you create effective data visualizations?",
        "Describe your statistical analysis approach.",
        "How do you handle large datasets efficiently?",
        "Explain your experience with BI tools like Tableau or Power BI.",
        "How do you ensure data quality and accuracy?",
        "Describe your approach to data modeling."
      ],
      behavioral: [
        "How do you present data insights to non-technical audiences?",
        "Tell me about a time you discovered an important business insight.",
        "How do you prioritize multiple data analysis requests?",
        "Describe your approach to stakeholder communication.",
        "How do you validate your analysis results?",
        "Tell me about a time you had to work with incomplete data.",
        "How do you stay updated with data analysis trends?",
        "Describe your experience with agile analytics."
      ]
    },
    'Product Manager': {
      technical: [
        "How do you prioritize features using data-driven approaches?",
        "Describe your experience with A/B testing frameworks.",
        "How do you define and track product metrics?",
        "Explain your approach to technical requirement gathering.",
        "How do you balance technical debt with new features?",
        "Describe your experience with agile methodologies.",
        "How do you validate product-market fit?",
        "Explain your approach to user research and feedback analysis."
      ],
      behavioral: [
        "Tell me about a time you had to say no to a feature request.",
        "How do you handle conflicting priorities from stakeholders?",
        "Describe a product launch you led.",
        "How do you build consensus among cross-functional teams?",
        "Tell me about a time you had to pivot on a product decision.",
        "How do you mentor and develop your team?",
        "Describe your approach to stakeholder management.",
        "How do you stay customer-focused in decision making?"
      ]
    },
    'DevOps Engineer': {
      technical: [
        "How do you design and implement CI/CD pipelines?",
        "Explain your experience with infrastructure as code.",
        "How do you approach container orchestration?",
        "Describe your monitoring and alerting strategies.",
        "How do you handle incident response and resolution?",
        "Explain your experience with cloud platforms.",
        "How do you ensure system security and compliance?",
        "Describe your approach to performance optimization."
      ],
      behavioral: [
        "How do you collaborate with development and operations teams?",
        "Tell me about a time you improved deployment processes.",
        "How do you balance speed and reliability in deployments?",
        "Describe your approach to knowledge sharing in DevOps culture.",
        "How do you handle post-mortem reviews after incidents?",
        "Tell me about a time you automated a complex process.",
        "How do you stay updated with DevOps tools and practices?",
        "Describe your experience with cross-team collaboration."
      ]
    },
    'UI/UX Designer': {
      technical: [
        "How do you approach user research and usability testing?",
        "Explain your design system and component library experience.",
        "How do you ensure accessibility in your designs?",
        "Describe your prototyping and wireframing process.",
        "How do you handle design handoff to developers?",
        "Explain your experience with design tools and software.",
        "How do you approach responsive and mobile-first design?",
        "Describe your user flow and journey mapping process."
      ],
      behavioral: [
        "How do you handle feedback and iteration on designs?",
        "Tell me about a time you had to defend a design decision.",
        "How do you collaborate with developers and product teams?",
        "Describe your approach to user empathy and understanding.",
        "How do you balance business goals with user needs?",
        "Tell me about a time you improved user experience significantly.",
        "How do you stay updated with design trends and best practices?",
        "Describe your experience with cross-functional design projects."
      ]
    },
    'Mobile App Developer': {
      technical: [
        "How do you approach mobile app architecture design?",
        "Explain your experience with native vs cross-platform development.",
        "How do you optimize mobile app performance?",
        "Describe your approach to mobile UI/UX implementation.",
        "How do you handle device compatibility and testing?",
        "Explain your experience with mobile APIs and services.",
        "How do you approach mobile security considerations?",
        "Describe your app store submission and deployment process."
      ],
      behavioral: [
        "How do you handle platform-specific design requirements?",
        "Tell me about a mobile app project you led.",
        "How do you balance app features with performance?",
        "Describe your approach to mobile user testing.",
        "How do you stay updated with mobile development trends?",
        "Tell me about a time you optimized app performance.",
        "How do you collaborate with designers for mobile projects?",
        "Describe your experience with app store guidelines and reviews."
      ]
    },
    'Security Engineer': {
      technical: [
        "How do you approach threat modeling and risk assessment?",
        "Explain your experience with security tools and technologies.",
        "How do you implement secure coding practices?",
        "Describe your incident response and forensics experience.",
        "How do you approach compliance and regulatory requirements?",
        "Explain your experience with encryption and cryptography.",
        "How do you handle vulnerability assessment and penetration testing?",
        "Describe your approach to security monitoring and alerting."
      ],
      behavioral: [
        "How do you communicate security risks to non-technical stakeholders?",
        "Tell me about a security incident you responded to.",
        "How do you balance security with usability?",
        "Describe your approach to security awareness training.",
        "How do you stay updated with emerging security threats?",
        "Tell me about a time you implemented a security improvement.",
        "How do you collaborate with development teams on security?",
        "Describe your experience with security audits and assessments."
      ]
    },
    'QA Engineer': {
      technical: [
        "How do you design comprehensive test suites?",
        "Explain your experience with automated testing frameworks.",
        "How do you approach test case design and coverage?",
        "Describe your experience with performance testing.",
        "How do you handle test environment setup and management?",
        "Explain your approach to bug tracking and reporting.",
        "How do you ensure test quality and effectiveness?",
        "Describe your experience with CI/CD integration testing."
      ],
      behavioral: [
        "How do you collaborate with developers to improve quality?",
        "Tell me about a time you found a critical bug before release.",
        "How do you balance thorough testing with release timelines?",
        "Describe your approach to test automation strategy.",
        "How do you handle conflicting priorities in testing?",
        "Tell me about a time you improved testing processes.",
        "How do you stay updated with testing methodologies?",
        "Describe your experience with agile testing practices."
      ]
    },
    'System Administrator': {
      technical: [
        "How do you approach system capacity planning?",
        "Explain your experience with server administration.",
        "How do you handle backup and disaster recovery?",
        "Describe your approach to system monitoring and alerting.",
        "How do you manage user access and permissions?",
        "Explain your experience with virtualization technologies.",
        "How do you approach system security hardening?",
        "Describe your network administration experience."
      ],
      behavioral: [
        "How do you handle system downtime and emergency response?",
        "Tell me about a time you optimized system performance.",
        "How do you balance system stability with feature requests?",
        "Describe your approach to documentation and knowledge sharing.",
        "How do you stay updated with system administration technologies?",
        "Tell me about a time you automated a system administration task.",
        "How do you collaborate with development and operations teams?",
        "Describe your experience with change management processes."
      ]
    },
    'Database Administrator': {
      technical: [
        "How do you approach database design and normalization?",
        "Explain your experience with database performance tuning.",
        "How do you handle database backup and recovery?",
        "Describe your approach to database security.",
        "How do you manage database migrations and schema changes?",
        "Explain your experience with database replication and clustering.",
        "How do you monitor database health and performance?",
        "Describe your approach to query optimization."
      ],
      behavioral: [
        "How do you collaborate with application developers?",
        "Tell me about a time you resolved a critical database issue.",
        "How do you balance database performance with data integrity?",
        "Describe your approach to database documentation.",
        "How do you stay updated with database technologies?",
        "Tell me about a time you optimized database performance.",
        "How do you handle database change management?",
        "Describe your experience with database auditing and compliance."
      ]
    },
    'Cloud Architect': {
      technical: [
        "How do you design scalable cloud architectures?",
        "Explain your experience with multi-cloud strategies.",
        "How do you approach cloud security and compliance?",
        "Describe your experience with serverless architectures.",
        "How do you handle cloud cost optimization?",
        "Explain your approach to cloud migration strategies.",
        "How do you ensure high availability and disaster recovery?",
        "Describe your experience with cloud monitoring and logging."
      ],
      behavioral: [
        "How do you communicate cloud strategy to business stakeholders?",
        "Tell me about a cloud migration project you led.",
        "How do you balance innovation with operational stability?",
        "Describe your approach to cloud governance and policies.",
        "How do you stay updated with cloud technologies?",
        "Tell me about a time you optimized cloud costs significantly.",
        "How do you collaborate with development teams on cloud adoption?",
        "Describe your experience with cloud vendor management."
      ]
    },
    'Machine Learning Engineer': {
      technical: [
        "How do you approach model training and deployment pipelines?",
        "Explain your experience with MLOps practices.",
        "How do you handle model versioning and rollback?",
        "Describe your approach to feature engineering at scale.",
        "How do you ensure model fairness and reduce bias?",
        "Explain your experience with distributed training.",
        "How do you monitor model performance in production?",
        "Describe your approach to A/B testing ML models."
      ],
      behavioral: [
        "How do you collaborate with data scientists and engineers?",
        "Tell me about a time you deployed a model to production.",
        "How do you balance model accuracy with inference speed?",
        "Describe your approach to ML model documentation.",
        "How do you stay updated with ML research and tools?",
        "Tell me about a time you optimized model performance.",
        "How do you handle model failures and rollbacks?",
        "Describe your experience with cross-functional ML projects."
      ]
    },
    'Technical Writer': {
      technical: [
        "How do you approach API documentation creation?",
        "Explain your experience with documentation tools and platforms.",
        "How do you ensure documentation accuracy and completeness?",
        "Describe your approach to user guide creation.",
        "How do you handle version control for documentation?",
        "Explain your experience with content management systems.",
        "How do you approach documentation for complex technical systems?",
        "Describe your process for gathering requirements from technical teams."
      ],
      behavioral: [
        "How do you balance technical accuracy with readability?",
        "Tell me about a time you improved documentation quality.",
        "How do you collaborate with technical teams for documentation?",
        "Describe your approach to user feedback on documentation.",
        "How do you stay updated with documentation best practices?",
        "Tell me about a time you streamlined documentation processes.",
        "How do you handle documentation for rapidly changing products?",
        "Describe your experience with localization and translation."
      ]
    },
    'Project Manager': {
      technical: [
        "How do you approach project planning and scheduling?",
        "Explain your experience with project management methodologies.",
        "How do you handle risk assessment and mitigation?",
        "Describe your approach to resource allocation.",
        "How do you track project progress and KPIs?",
        "Explain your experience with project management tools.",
        "How do you approach change management in projects?",
        "Describe your stakeholder communication strategy."
      ],
      behavioral: [
        "Tell me about a time you successfully delivered a complex project.",
        "How do you handle scope creep and changing requirements?",
        "Describe your approach to team motivation and morale.",
        "How do you resolve conflicts within project teams?",
        "Tell me about a time you had to manage multiple projects simultaneously.",
        "How do you balance quality, scope, time, and budget?",
        "Describe your experience with vendor and contractor management.",
        "How do you stay updated with project management best practices?"
      ]
    },
    'Business Analyst': {
      technical: [
        "How do you approach requirements gathering and analysis?",
        "Explain your experience with process modeling and documentation.",
        "How do you handle data analysis for business decisions?",
        "Describe your approach to system requirements specification.",
        "How do you ensure requirements traceability?",
        "Explain your experience with business process reengineering.",
        "How do you approach user story creation and acceptance criteria?",
        "Describe your experience with agile requirements management."
      ],
      behavioral: [
        "How do you bridge the gap between business and technical teams?",
        "Tell me about a time you identified a critical business requirement.",
        "How do you handle conflicting stakeholder requirements?",
        "Describe your approach to change management and adoption.",
        "How do you stay updated with business analysis methodologies?",
        "Tell me about a time you improved business processes.",
        "How do you validate solution effectiveness?",
        "Describe your experience with organizational change initiatives."
      ]
    },
    'Network Engineer': {
      technical: [
        "How do you approach network design and architecture?",
        "Explain your experience with network security implementation.",
        "How do you handle network troubleshooting and diagnostics?",
        "Describe your approach to network performance optimization.",
        "How do you manage network infrastructure and equipment?",
        "Explain your experience with network monitoring tools.",
        "How do you approach network capacity planning?",
        "Describe your experience with network protocols and standards."
      ],
      behavioral: [
        "How do you handle network downtime and business impact?",
        "Tell me about a time you upgraded network infrastructure.",
        "How do you balance network security with accessibility?",
        "Describe your approach to network documentation and procedures.",
        "How do you stay updated with networking technologies?",
        "Tell me about a time you resolved a complex network issue.",
        "How do you collaborate with other IT teams?",
        "Describe your experience with network compliance and auditing."
      ]
    },
    'Scrum Master': {
      technical: [
        "How do you facilitate Scrum ceremonies effectively?",
        "Explain your approach to sprint planning and commitment.",
        "How do you handle impediments and blockers?",
        "Describe your experience with agile metrics and reporting.",
        "How do you approach team velocity and capacity planning?",
        "Explain your experience with agile tools and software.",
        "How do you facilitate retrospectives and continuous improvement?",
        "Describe your approach to agile coaching and mentoring."
      ],
      behavioral: [
        "How do you build and maintain team trust and transparency?",
        "Tell me about a time you helped a team overcome dysfunction.",
        "How do you balance team autonomy with organizational goals?",
        "Describe your approach to conflict resolution in agile teams.",
        "How do you stay updated with agile and Scrum practices?",
        "Tell me about a time you improved team performance significantly.",
        "How do you handle resistance to agile transformation?",
        "Describe your experience with scaling agile practices."
      ]
    },
    'Marketing Manager': {
      technical: [
        "How do you approach digital marketing campaign planning?",
        "Explain your experience with marketing analytics and attribution.",
        "How do you handle content marketing and SEO strategies?",
        "Describe your approach to social media marketing.",
        "How do you manage marketing automation and CRM systems?",
        "Explain your experience with A/B testing and optimization.",
        "How do you approach brand management and positioning?",
        "Describe your experience with marketing technology stacks."
      ],
      behavioral: [
        "How do you align marketing strategies with business objectives?",
        "Tell me about a time you turned around a failing campaign.",
        "How do you collaborate with sales and product teams?",
        "Describe your approach to budget management and ROI tracking.",
        "How do you stay updated with marketing trends and technologies?",
        "Tell me about a time you built a successful marketing campaign.",
        "How do you handle crisis communication and reputation management?",
        "Describe your experience with cross-functional marketing initiatives."
      ]
    },
    'Sales Engineer': {
      technical: [
        "How do you translate technical features into business value?",
        "Explain your approach to technical solution design for prospects.",
        "How do you handle technical objections and concerns?",
        "Describe your experience with product demonstrations.",
        "How do you collaborate with sales and technical teams?",
        "Explain your approach to proof of concept development.",
        "How do you stay current with technical product knowledge?",
        "Describe your experience with competitive analysis."
      ],
      behavioral: [
        "How do you build credibility with technical and business stakeholders?",
        "Tell me about a time you closed a complex technical sale.",
        "How do you handle the sales engineering handover process?",
        "Describe your approach to customer relationship building.",
        "How do you balance technical depth with business acumen?",
        "Tell me about a time you educated a prospect on technical concepts.",
        "How do you stay updated with industry trends and technologies?",
        "Describe your experience with post-sale technical support."
      ]
    },
    'HR Manager': {
      technical: [
        "How do you approach talent acquisition and recruitment strategies?",
        "Explain your experience with HRIS and ATS systems.",
        "How do you handle performance management systems?",
        "Describe your approach to compensation and benefits administration.",
        "How do you manage employee data and compliance?",
        "Explain your experience with learning management systems.",
        "How do you approach workforce planning and analytics?",
        "Describe your experience with HR metrics and reporting."
      ],
      behavioral: [
        "How do you foster a positive company culture?",
        "Tell me about a time you managed organizational change.",
        "How do you handle employee relations and conflict resolution?",
        "Describe your approach to diversity, equity, and inclusion.",
        "How do you stay updated with HR laws and regulations?",
        "Tell me about a time you improved employee engagement.",
        "How do you balance employee needs with business objectives?",
        "Describe your experience with leadership development programs."
      ]
    },
    'Financial Analyst': {
      technical: [
        "How do you approach financial modeling and forecasting?",
        "Explain your experience with financial analysis tools and software.",
        "How do you handle variance analysis and budget tracking?",
        "Describe your approach to investment analysis and valuation.",
        "How do you manage financial reporting and compliance?",
        "Explain your experience with risk assessment and management.",
        "How do you approach cost-benefit analysis?",
        "Describe your experience with financial data visualization."
      ],
      behavioral: [
        "How do you communicate complex financial information to non-financial stakeholders?",
        "Tell me about a time you identified a significant financial opportunity or risk.",
        "How do you handle conflicting priorities in financial analysis?",
        "Describe your approach to stakeholder management in finance.",
        "How do you stay updated with financial regulations and standards?",
        "Tell me about a time you improved financial processes or systems.",
        "How do you balance accuracy with timeliness in financial reporting?",
        "Describe your experience with cross-functional financial collaboration."
      ]
    }
  };

  // Get questions for the specific job role or use general questions
  const roleQuestions = questionTemplates[jobRole] || questionTemplates['Software Engineer'];

  let questionIndex = 0;

  // Add technical questions
  if (includeTechnical) {
    const technicalCount = Math.ceil(totalQuestions * 0.6); // 60% technical
    for (let i = 0; i < technicalCount && questionIndex < totalQuestions; i++) {
      const question = roleQuestions.technical[i % roleQuestions.technical.length];
      questions.push({
        question,
        type: 'technical',
        difficulty: i < technicalCount * 0.3 ? 'easy' : i < technicalCount * 0.7 ? 'medium' : 'hard',
        topic: 'Technical Skills',
        order: questionIndex++
      });
    }
  }

  // Add behavioral questions
  if (includeBehavioral) {
    const behavioralCount = totalQuestions - questions.length;
    for (let i = 0; i < behavioralCount && questionIndex < totalQuestions; i++) {
      const question = roleQuestions.behavioral[i % roleQuestions.behavioral.length];
      questions.push({
        question,
        type: 'behavioral',
        difficulty: i < behavioralCount * 0.4 ? 'easy' : i < behavioralCount * 0.8 ? 'medium' : 'hard',
        topic: 'Behavioral Skills',
        order: questionIndex++
      });
    }
  }

  return questions;
}

// Generate AI feedback for answers (mock implementation - in production, use AI)
async function generateAIFeedback(question, answer, jobRole) {
  // Mock AI feedback - in production, this would call an AI service
  const feedbackTemplates = {
    technical: {
      strengths: [
        "Clear technical understanding demonstrated",
        "Good use of relevant terminology",
        "Logical problem-solving approach",
        "Practical experience evident"
      ],
      improvements: [
        "Could provide more specific examples",
        "Consider mentioning alternative approaches",
        "Add more technical depth",
        "Include performance considerations"
      ]
    },
    behavioral: {
      strengths: [
        "Good communication skills",
        "Clear example provided",
        "Shows self-awareness",
        "Demonstrates growth mindset"
      ],
      improvements: [
        "Could be more specific about outcomes",
        "Consider quantifying impact",
        "Add more context about challenges",
        "Include lessons learned"
      ]
    }
  };

  const questionType = question.type;
  const templates = feedbackTemplates[questionType];

  // Generate random but realistic scores
  const baseScore = Math.floor(Math.random() * 4) + 6; // 6-9 range
  const relevance = Math.floor(Math.random() * 3) + baseScore - 1;
  const clarity = Math.floor(Math.random() * 3) + baseScore - 1;
  const completeness = Math.floor(Math.random() * 3) + baseScore - 1;

  const finalScore = Math.round((relevance + clarity + completeness) / 3);

  return {
    score: finalScore,
    strengths: templates.strengths.slice(0, Math.floor(Math.random() * 2) + 2),
    improvements: templates.improvements.slice(0, Math.floor(Math.random() * 2) + 1),
    relevance,
    clarity,
    completeness,
    comments: generateFeedbackComment(questionType, finalScore, answer.length)
  };
}

function generateFeedbackComment(type, score, answerLength) {
  const comments = {
    technical: {
      high: [
        "Excellent technical response with strong problem-solving approach.",
        "Demonstrates deep understanding of technical concepts.",
        "Clear, concise, and technically accurate answer."
      ],
      medium: [
        "Good technical foundation, could benefit from more specific examples.",
        "Solid understanding shown, consider adding implementation details.",
        "Technical knowledge is evident, focus on practical applications."
      ],
      low: [
        "Basic understanding demonstrated, recommend deeper technical study.",
        "Response lacks technical depth, consider researching the topic further.",
        "More technical details and examples would strengthen this answer."
      ]
    },
    behavioral: {
      high: [
        "Excellent example with clear structure and strong communication.",
        "Well-articulated response showing self-awareness and growth.",
        "Compelling story with clear lessons learned and impact."
      ],
      medium: [
        "Good example provided, could be more specific about outcomes.",
        "Solid response, consider adding more context about challenges faced.",
        "Clear communication, focus on quantifying impact and results."
      ],
      low: [
        "Response needs more specific examples and outcomes.",
        "Consider providing more context and measurable results.",
        "Focus on specific situations and learnings from experiences."
      ]
    }
  };

  const scoreLevel = score >= 8 ? 'high' : score >= 6 ? 'medium' : 'low';
  const typeComments = comments[type][scoreLevel];
  return typeComments[Math.floor(Math.random() * typeComments.length)];
}

module.exports = router;
