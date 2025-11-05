const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// Search jobs based on skills/location using JSearch API
router.get('/search', auth, async (req, res) => {
  try {
    const { skills, location, keywords, page = 1, resumeId } = req.query;

    // If resumeId is provided, get personalized job recommendations
    if (resumeId) {
      const personalizedJobs = await getPersonalizedJobRecommendations(req.user.id, resumeId);
      return res.json(personalizedJobs);
    }

    // Build search query
    let query = 'developer'; // default search
    if (keywords) {
      query = keywords;
    } else if (skills) {
      // Use the first skill as primary search term
      query = skills.split(',')[0].trim();
    }

    // Prepare API request to JSearch (RapidAPI)
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: `${query} developer`,
        location: location || '',
        page: page.toString(),
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY || 'demo-key',
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST || 'jsearch.p.rapidapi.com'
      }
    };

    // If no real API key, return demo data with real job URLs from multiple platforms
    if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your-rapidapi-key-here') {
      const demoJobs = [
        {
          id: '1',
          title: "Frontend Developer",
          company: "Google",
          location: "Mountain View, CA",
          salary: "$120k - $180k",
          description: "Build next-generation web applications using React, TypeScript, and modern web technologies. Work with a world-class engineering team.",
          skills: ["React", "TypeScript", "JavaScript", "CSS", "Node.js", "HTML", "SASS", "Webpack"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=frontend+developer&location=California&f_C=1441",
          matchScore: 85,
          matchReasons: ["Strong React experience", "TypeScript proficiency", "Modern web technologies"]
        },
        {
          id: '2',
          title: "Full Stack Developer",
          company: "Microsoft",
          location: "Seattle, WA",
          salary: "$130k - $190k",
          description: "Develop and maintain scalable web applications using .NET, React, and Azure cloud services.",
          skills: ["React", "C#", ".NET", "Azure", "SQL", "JavaScript", "MongoDB", "Express"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=full+stack+developer&location=Seattle&f_C=1035",
          matchScore: 78,
          matchReasons: ["Full-stack capabilities", "Cloud experience", "Database skills"]
        },
        {
          id: '3',
          title: "Software Engineer",
          company: "Amazon",
          location: "Remote",
          salary: "$110k - $170k",
          description: "Work on distributed systems and cloud infrastructure. Experience with AWS, Python, and microservices required.",
          skills: ["Python", "AWS", "Docker", "Kubernetes", "Java", "Microservices", "REST API", "Django"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=software+engineer&f_WT=2",
          matchScore: 92,
          matchReasons: ["Python expertise", "AWS experience", "Microservices knowledge"]
        },
        {
          id: '4',
          title: "React Developer",
          company: "Meta",
          location: "Menlo Park, CA",
          salary: "$140k - $200k",
          description: "Build user-facing web applications for billions of users. Focus on performance, accessibility, and user experience.",
          skills: ["React", "JavaScript", "GraphQL", "Redux", "CSS", "TypeScript", "Jest", "Next.js"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=react+developer&location=California&f_C=10667",
          matchScore: 88,
          matchReasons: ["Advanced React skills", "GraphQL experience", "Performance optimization"]
        },
        {
          id: '5',
          title: "Backend Developer",
          company: "Netflix",
          location: "Los Gatos, CA",
          salary: "$150k - $220k",
          description: "Design and implement scalable backend services. Work with microservices architecture and cloud technologies.",
          skills: ["Java", "Spring Boot", "AWS", "Docker", "Kafka", "PostgreSQL", "Redis", "Microservices"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=backend+developer&location=California&f_C=165158",
          matchScore: 76,
          matchReasons: ["Backend development experience", "Database knowledge", "API design"]
        },
        {
          id: '6',
          title: "DevOps Engineer",
          company: "Spotify",
          location: "New York, NY",
          salary: "$120k - $180k",
          description: "Manage CI/CD pipelines, infrastructure as code, and cloud deployments. Experience with Kubernetes and monitoring tools.",
          skills: ["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins", "Linux", "Python", "Ansible"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=devops+engineer&location=New+York&f_C=147195",
          matchScore: 81,
          matchReasons: ["DevOps tools experience", "Cloud infrastructure", "Automation skills"]
        },
        {
          id: '7',
          title: "Python Developer",
          company: "Tesla",
          location: "Austin, TX",
          salary: "$115k - $175k",
          description: "Develop Python applications for autonomous vehicle systems. Work with machine learning and data processing pipelines.",
          skills: ["Python", "Django", "Flask", "Machine Learning", "Pandas", "NumPy", "TensorFlow", "FastAPI"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=python+developer&location=Texas&f_C=4319",
          matchScore: 89,
          matchReasons: ["Python proficiency", "ML experience", "Data processing skills"]
        },
        {
          id: '8',
          title: "Mobile App Developer",
          company: "Apple",
          location: "Cupertino, CA",
          salary: "$130k - $200k",
          description: "Create innovative mobile applications for iOS devices. Experience with Swift and iOS development required.",
          skills: ["Swift", "iOS", "Xcode", "Objective-C", "UIKit", "Core Data", "SwiftUI", "React Native"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=ios+developer&location=California&f_C=162479",
          matchScore: 74,
          matchReasons: ["Mobile development experience", "iOS expertise", "App development"]
        },
        {
          id: '9',
          title: "Data Scientist",
          company: "Uber",
          location: "San Francisco, CA",
          salary: "$140k - $210k",
          description: "Analyze large datasets to improve ride-sharing algorithms and user experience. Strong statistical and machine learning skills required.",
          skills: ["Python", "R", "Machine Learning", "SQL", "Tableau", "Spark", "Hadoop", "Statistics"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=data+scientist&location=San+Francisco&f_C=1815218",
          matchScore: 91,
          matchReasons: ["Data science expertise", "ML algorithms", "Statistical analysis"]
        },
        {
          id: '10',
          title: "UI/UX Designer",
          company: "Adobe",
          location: "San Jose, CA",
          salary: "$100k - $160k",
          description: "Design intuitive user interfaces and experiences for creative software products. Proficiency in design tools required.",
          skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Design Systems", "InVision"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.indeed.com/jobs?q=ui+ux+designer&l=California",
          matchScore: 67,
          matchReasons: ["Design tool proficiency", "UI/UX experience", "Prototyping skills"]
        },
        {
          id: '11',
          title: "Database Administrator",
          company: "Oracle",
          location: "Redwood City, CA",
          salary: "$110k - $170k",
          description: "Manage and optimize large-scale database systems. Experience with Oracle databases and performance tuning required.",
          skills: ["Oracle", "SQL", "PL/SQL", "Database Administration", "Performance Tuning", "Backup & Recovery", "MySQL", "PostgreSQL"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=database+administrator&location=California&f_C=1028",
          matchScore: 83,
          matchReasons: ["Database administration", "SQL expertise", "Performance tuning"]
        },
        {
          id: '12',
          title: "Security Engineer",
          company: "Cisco",
          location: "San Jose, CA",
          salary: "$125k - $185k",
          description: "Implement and maintain cybersecurity measures for enterprise networks. Knowledge of security protocols and threat analysis required.",
          skills: ["Cybersecurity", "Network Security", "Firewalls", "SIEM", "Penetration Testing", "Python", "Linux", "Ethical Hacking"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=security+engineer&location=California&f_C=1063",
          matchScore: 79,
          matchReasons: ["Security expertise", "Network knowledge", "Compliance experience"]
        },
        {
          id: '13',
          title: "Angular Developer",
          company: "IBM",
          location: "Austin, TX",
          salary: "$105k - $165k",
          description: "Develop enterprise applications using Angular framework. Experience with TypeScript and RxJS required.",
          skills: ["Angular", "TypeScript", "RxJS", "JavaScript", "HTML", "CSS", "Node.js", "Express"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.indeed.com/jobs?q=angular+developer&l=Texas",
          matchScore: 86,
          matchReasons: ["Angular expertise", "TypeScript skills", "Enterprise development"]
        },
        {
          id: '14',
          title: "Vue.js Developer",
          company: "GitLab",
          location: "Remote",
          salary: "$95k - $155k",
          description: "Build and maintain Vue.js applications for the GitLab platform. Experience with Vue ecosystem and testing frameworks.",
          skills: ["Vue.js", "JavaScript", "Vuex", "Nuxt.js", "Jest", "Cypress", "TypeScript", "GraphQL"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=vue+js+developer&f_WT=2&f_C=3808127",
          matchScore: 82,
          matchReasons: ["Vue.js proficiency", "JavaScript skills", "Testing experience"]
        },
        {
          id: '15',
          title: "Blockchain Developer",
          company: "Coinbase",
          location: "Remote",
          salary: "$135k - $195k",
          description: "Develop smart contracts and blockchain applications. Experience with Solidity and Web3 technologies required.",
          skills: ["Solidity", "Web3", "Ethereum", "Smart Contracts", "JavaScript", "React", "Node.js", "Truffle"],
          postedDate: new Date().toISOString(),
          applyUrl: "https://www.linkedin.com/jobs/search/?keywords=blockchain+developer&f_WT=2&f_C=11700",
          matchScore: 77,
          matchReasons: ["Blockchain experience", "Smart contract development", "Web3 knowledge"]
        }
      ];

      // Apply filtering based on search parameters
      let filteredJobs = demoJobs;

      if (skills || location || keywords) {
        filteredJobs = demoJobs.filter(job => {
          let matches = true;

          // Skills matching
          if (skills) {
            const skillArray = skills.split(',').map(s => s.trim().toLowerCase()).filter(s => s.length > 0);
            if (skillArray.length > 0) {
              const jobSkills = job.skills.map(s => s.toLowerCase());
              const skillMatch = skillArray.some(userSkill =>
                jobSkills.some(jobSkill =>
                  jobSkill.includes(userSkill) || userSkill.includes(jobSkill)
                )
              );
              if (!skillMatch) matches = false;
            }
          }

          // Location matching
          if (location && matches) {
            const locationLower = location.toLowerCase();
            const jobLocation = job.location.toLowerCase();
            if (!jobLocation.includes(locationLower) &&
                !locationLower.includes(jobLocation.split(',')[0].trim()) &&
                !jobLocation.includes('remote')) {
              matches = false;
            }
          }

          // Keywords matching
          if (keywords && matches) {
            const keywordLower = keywords.toLowerCase();
            const jobText = `${job.title} ${job.description} ${job.skills.join(' ')}`.toLowerCase();
            if (!jobText.includes(keywordLower)) {
              matches = false;
            }
          }

          return matches;
        });

        // If no matches found, return jobs with some relevance
        if (filteredJobs.length === 0) {
          filteredJobs = demoJobs.slice(0, 5); // Return top 5 as suggestions
        }
      }

      console.log('Returning filtered demo jobs, params:', { skills, location, keywords, count: filteredJobs.length });
      return res.json(filteredJobs);
    }

    // Make real API call
    const response = await axios.request(options);

    // Transform JSearch API response to our format
    const jobs = response.data.data.map(job => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country || 'Remote',
      salary: job.job_min_salary && job.job_max_salary
        ? `$${job.job_min_salary}k - $${job.job_max_salary}k`
        : job.job_min_salary
        ? `$${job.job_min_salary}k+`
        : 'Salary not specified',
      description: job.job_description || job.job_highlights?.Summary?.join(' ') || 'No description available',
      skills: job.job_required_skills || [],
      postedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
      applyUrl: job.job_apply_link || `https://linkedin.com/jobs/view/${job.job_id}`,
      matchScore: 75, // Default match score for API results
      matchReasons: ["Skills alignment", "Experience match", "Location fit"]
    }));

    res.json(jobs);
  } catch (error) {
    console.error('Job search error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Job search failed' });
  }
});

// Get job details
router.get('/:id', auth, async (req, res) => {
  try {
    const jobId = req.params.id;

    // If using demo data, return mock details
    if (!process.env.RAPIDAPI_KEY || process.env.RAPIDAPI_KEY === 'your-rapidapi-key-here') {
      const jobDetails = {
        id: jobId,
        title: "Software Developer",
        company: "Tech Company",
        location: "San Francisco, CA",
        salary: "$100k - $130k",
        description: "We are looking for a talented software developer to join our team. You will work on cutting-edge web applications using modern technologies including React, Node.js, and cloud services.",
        requirements: ["3+ years experience", "React", "Node.js", "JavaScript", "Git"],
        benefits: ["Health insurance", "Remote work options", "401k matching", "Professional development budget"],
        postedDate: new Date().toISOString(),
        applyUrl: "https://linkedin.com/jobs/view/software-developer-tech-company"
      };
      return res.json(jobDetails);
    }

    // Make real API call for job details
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/job-details',
      params: { job_id: jobId },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': process.env.RAPIDAPI_HOST
      }
    };

    const response = await axios.request(options);
    const job = response.data.data[0];

    const jobDetails = {
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country,
      salary: job.job_min_salary && job.job_max_salary
        ? `$${job.job_min_salary}k - $${job.job_max_salary}k`
        : 'Salary not specified',
      description: job.job_description,
      requirements: job.job_required_skills || [],
      benefits: job.job_benefits || [],
      postedDate: job.job_posted_at_datetime_utc,
      applyUrl: job.job_apply_link
    };

    res.json(jobDetails);
  } catch (error) {
    console.error('Job details error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch job details' });
  }
});

// AI-powered personalized job recommendations based on resume analysis
async function getPersonalizedJobRecommendations(userId, resumeId) {
  try {
    // Import Resume model dynamically to avoid circular dependencies
    const Resume = require('../models/Resume');

    // Get the user's resume
    const resume = await Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
      throw new Error('Resume not found');
    }

    // Extract skills from resume
    const resumeSkills = extractSkillsFromResume(resume);

    // Analyze experience level and job preferences
    const experienceLevel = analyzeExperienceLevel(resume);
    const preferredRoles = inferPreferredRoles(resume, resumeSkills);

    // Get all available jobs
    const allJobs = getAllDemoJobs();

    // Calculate match scores for each job
    const scoredJobs = allJobs.map(job => {
      const matchScore = calculateJobMatchScore(job, resumeSkills, experienceLevel, preferredRoles, resume);
      return {
        ...job,
        matchScore,
        matchReasons: generateMatchReasons(job, resumeSkills, experienceLevel, resume)
      };
    });

    // Sort by match score and return top matches
    const topMatches = scoredJobs
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 8); // Return top 8 matches

    console.log(`Generated ${topMatches.length} personalized job recommendations for resume ${resumeId}`);
    return topMatches;

  } catch (error) {
    console.error('Personalized job recommendations error:', error);
    // Fallback to regular job search
    return getAllDemoJobs().slice(0, 6);
  }
}

// Extract skills from resume content
function extractSkillsFromResume(resume) {
  const skills = new Set();

  // Add explicitly listed skills
  if (resume.skills && Array.isArray(resume.skills)) {
    resume.skills.forEach(skill => skills.add(skill.toLowerCase()));
  }

  // Extract skills from experience descriptions
  if (resume.experience && Array.isArray(resume.experience)) {
    resume.experience.forEach(exp => {
      if (exp.description) {
        const techKeywords = extractTechKeywords(exp.description);
        techKeywords.forEach(keyword => skills.add(keyword.toLowerCase()));
      }
      if (exp.technologies) {
        exp.technologies.forEach(tech => skills.add(tech.toLowerCase()));
      }
    });
  }

  // Extract from projects
  if (resume.projects && Array.isArray(resume.projects)) {
    resume.projects.forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => skills.add(tech.toLowerCase()));
      }
      if (project.description) {
        const techKeywords = extractTechKeywords(project.description);
        techKeywords.forEach(keyword => skills.add(keyword.toLowerCase()));
      }
    });
  }

  return Array.from(skills);
}

// Extract technical keywords from text
function extractTechKeywords(text) {
  const techKeywords = [
    // Programming Languages
    'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript',
    // Web Technologies
    'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'html', 'css', 'sass', 'less',
    // Databases
    'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sql server',
    // Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'linux', 'git',
    // Data Science & ML
    'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'machine learning', 'data science', 'sql', 'tableau', 'power bi',
    // Mobile
    'ios', 'android', 'react native', 'flutter', 'xamarin',
    // Other
    'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum'
  ];

  const found = [];
  const lowerText = text.toLowerCase();

  techKeywords.forEach(keyword => {
    if (lowerText.includes(keyword)) {
      found.push(keyword);
    }
  });

  return found;
}

// Analyze experience level from resume
function analyzeExperienceLevel(resume) {
  let totalYears = 0;
  let jobCount = 0;

  if (resume.experience && Array.isArray(resume.experience)) {
    resume.experience.forEach(exp => {
      if (exp.duration) {
        // Extract years from duration string (e.g., "2 years", "1.5 years")
        const yearMatch = exp.duration.match(/(\d+(?:\.\d+)?)\s*years?/i);
        if (yearMatch) {
          totalYears += parseFloat(yearMatch[1]);
          jobCount++;
        }
      }
    });
  }

  const avgYears = jobCount > 0 ? totalYears / jobCount : 0;

  if (avgYears >= 5) return 'senior';
  if (avgYears >= 2) return 'mid';
  return 'junior';
}

// Infer preferred roles based on resume content
function inferPreferredRoles(resume, skills) {
  const roles = [];

  // Check job titles and descriptions
  const jobTitles = [];
  if (resume.experience && Array.isArray(resume.experience)) {
    resume.experience.forEach(exp => {
      if (exp.position) jobTitles.push(exp.position.toLowerCase());
      if (exp.description) jobTitles.push(exp.description.toLowerCase());
    });
  }

  const titleText = jobTitles.join(' ');

  // Frontend roles
  if (skills.some(s => ['react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css'].includes(s)) ||
      titleText.includes('frontend') || titleText.includes('front-end')) {
    roles.push('frontend');
  }

  // Backend roles
  if (skills.some(s => ['node.js', 'python', 'java', 'php', 'ruby', 'go', 'c#', 'spring', 'django', 'flask'].includes(s)) ||
      titleText.includes('backend') || titleText.includes('back-end') || titleText.includes('server')) {
    roles.push('backend');
  }

  // Full stack roles
  if (roles.includes('frontend') && roles.includes('backend')) {
    roles.push('fullstack');
  }

  // Data roles
  if (skills.some(s => ['python', 'r', 'machine learning', 'data science', 'sql', 'pandas', 'numpy', 'tableau'].includes(s)) ||
      titleText.includes('data') || titleText.includes('analyst') || titleText.includes('scientist')) {
    roles.push('data');
  }

  // DevOps roles
  if (skills.some(s => ['docker', 'kubernetes', 'aws', 'azure', 'jenkins', 'terraform', 'ansible', 'linux'].includes(s)) ||
      titleText.includes('devops') || titleText.includes('infrastructure') || titleText.includes('cloud')) {
    roles.push('devops');
  }

  // Mobile roles
  if (skills.some(s => ['ios', 'android', 'swift', 'kotlin', 'react native', 'flutter'].includes(s)) ||
      titleText.includes('mobile') || titleText.includes('ios') || titleText.includes('android')) {
    roles.push('mobile');
  }

  return roles.length > 0 ? roles : ['general'];
}

// Calculate job match score based on multiple factors
function calculateJobMatchScore(job, resumeSkills, experienceLevel, preferredRoles, resume) {
  let score = 50; // Base score

  // Skills matching (40% weight)
  const jobSkills = job.skills.map(s => s.toLowerCase());
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());

  const skillMatches = jobSkills.filter(jobSkill =>
    resumeSkillsLower.some(resumeSkill =>
      jobSkill.includes(resumeSkill) || resumeSkill.includes(jobSkill)
    )
  );

  const skillMatchRatio = skillMatches.length / Math.max(jobSkills.length, 1);
  score += skillMatchRatio * 40;

  // Experience level matching (20% weight)
  const jobTitle = job.title.toLowerCase();
  const isSeniorRole = jobTitle.includes('senior') || jobTitle.includes('lead') || jobTitle.includes('principal');
  const isJuniorRole = jobTitle.includes('junior') || jobTitle.includes('entry') || jobTitle.includes('associate');

  if ((experienceLevel === 'senior' && isSeniorRole) ||
      (experienceLevel === 'mid' && !isSeniorRole && !isJuniorRole) ||
      (experienceLevel === 'junior' && (isJuniorRole || !isSeniorRole))) {
    score += 20;
  } else if ((experienceLevel === 'junior' && isSeniorRole) ||
             (experienceLevel === 'senior' && isJuniorRole)) {
    score -= 10; // Penalty for mismatch
  }

  // Role preference matching (20% weight)
  const jobRoleType = inferJobRoleType(job);
  if (preferredRoles.some(role => {
    if (role === 'frontend' && jobRoleType === 'frontend') return true;
    if (role === 'backend' && jobRoleType === 'backend') return true;
    if (role === 'fullstack' && jobRoleType === 'fullstack') return true;
    if (role === 'data' && jobRoleType === 'data') return true;
    if (role === 'devops' && jobRoleType === 'devops') return true;
    if (role === 'mobile' && jobRoleType === 'mobile') return true;
    return false;
  })) {
    score += 20;
  }

  // Company prestige bonus (10% weight)
  const topCompanies = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix', 'tesla'];
  if (topCompanies.includes(job.company.toLowerCase())) {
    score += 10;
  }

  // Location/remote work bonus (10% weight)
  if (job.location.toLowerCase().includes('remote') ||
      job.location.toLowerCase().includes(resume.location?.toLowerCase() || '')) {
    score += 10;
  }

  return Math.min(100, Math.max(0, Math.round(score)));
}

// Infer job role type from job data
function inferJobRoleType(job) {
  const title = job.title.toLowerCase();
  const description = job.description.toLowerCase();
  const skills = job.skills.map(s => s.toLowerCase());

  if (title.includes('frontend') || title.includes('front-end') ||
      skills.some(s => ['react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css'].includes(s))) {
    return 'frontend';
  }

  if (title.includes('backend') || title.includes('back-end') || title.includes('server') ||
      skills.some(s => ['node.js', 'python', 'java', 'php', 'ruby', 'go', 'c#', 'spring', 'django'].includes(s))) {
    return 'backend';
  }

  if (title.includes('full') && title.includes('stack') ||
      (skills.some(s => ['react', 'angular', 'vue'].includes(s)) &&
       skills.some(s => ['node.js', 'python', 'java', 'php'].includes(s)))) {
    return 'fullstack';
  }

  if (title.includes('data') || title.includes('analyst') || title.includes('scientist') ||
      skills.some(s => ['python', 'r', 'machine learning', 'sql', 'tableau', 'pandas'].includes(s))) {
    return 'data';
  }

  if (title.includes('devops') || title.includes('infrastructure') || title.includes('cloud') ||
      skills.some(s => ['docker', 'kubernetes', 'aws', 'azure', 'terraform', 'ansible'].includes(s))) {
    return 'devops';
  }

  if (title.includes('mobile') || title.includes('ios') || title.includes('android') ||
      skills.some(s => ['swift', 'kotlin', 'react native', 'flutter'].includes(s))) {
    return 'mobile';
  }

  return 'general';
}

// Generate human-readable match reasons
function generateMatchReasons(job, resumeSkills, experienceLevel, resume) {
  const reasons = [];

  // Skills-based reasons
  const jobSkills = job.skills.map(s => s.toLowerCase());
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase());

  const skillMatches = jobSkills.filter(jobSkill =>
    resumeSkillsLower.some(resumeSkill =>
      jobSkill.includes(resumeSkill) || resumeSkill.includes(jobSkill)
    )
  );

  if (skillMatches.length > 0) {
    reasons.push(`${skillMatches.length} skill match${skillMatches.length > 1 ? 'es' : ''} found`);
  }

  // Experience level reasons
  const jobTitle = job.title.toLowerCase();
  const isSeniorRole = jobTitle.includes('senior') || jobTitle.includes('lead');
  const isJuniorRole = jobTitle.includes('junior') || jobTitle.includes('entry');

  if ((experienceLevel === 'senior' && isSeniorRole) ||
      (experienceLevel === 'mid' && !isSeniorRole && !isJuniorRole)) {
    reasons.push('Experience level matches your background');
  }

  // Location/remote reasons
  if (job.location.toLowerCase().includes('remote')) {
    reasons.push('Remote work opportunity');
  } else if (resume.location && job.location.toLowerCase().includes(resume.location.toLowerCase())) {
    reasons.push('Location matches your preferences');
  }

  // Company prestige
  const topCompanies = ['google', 'microsoft', 'amazon', 'meta', 'apple', 'netflix', 'tesla'];
  if (topCompanies.includes(job.company.toLowerCase())) {
    reasons.push('Top-tier company opportunity');
  }

  // Default reasons if none found
  if (reasons.length === 0) {
    reasons.push('Skills alignment with job requirements');
    reasons.push('Relevant experience match');
  }

  return reasons.slice(0, 3); // Return top 3 reasons
}

// Get all demo jobs (helper function)
function getAllDemoJobs() {
  return [
    {
      id: '1',
      title: "Frontend Developer",
      company: "Google",
      location: "Mountain View, CA",
      salary: "$120k - $180k",
      description: "Build next-generation web applications using React, TypeScript, and modern web technologies. Work with a world-class engineering team.",
      skills: ["React", "TypeScript", "JavaScript", "CSS", "Node.js", "HTML", "SASS", "Webpack"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=frontend+developer&location=California&f_C=1441",
      matchScore: 85,
      matchReasons: ["Strong React experience", "TypeScript proficiency", "Modern web technologies"]
    },
    {
      id: '2',
      title: "Full Stack Developer",
      company: "Microsoft",
      location: "Seattle, WA",
      salary: "$130k - $190k",
      description: "Develop and maintain scalable web applications using .NET, React, and Azure cloud services.",
      skills: ["React", "C#", ".NET", "Azure", "SQL", "JavaScript", "MongoDB", "Express"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=full+stack+developer&location=Seattle&f_C=1035",
      matchScore: 78,
      matchReasons: ["Full-stack capabilities", "Cloud experience", "Database skills"]
    },
    {
      id: '3',
      title: "Software Engineer",
      company: "Amazon",
      location: "Remote",
      salary: "$110k - $170k",
      description: "Work on distributed systems and cloud infrastructure. Experience with AWS, Python, and microservices required.",
      skills: ["Python", "AWS", "Docker", "Kubernetes", "Java", "Microservices", "REST API", "Django"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=software+engineer&f_WT=2",
      matchScore: 92,
      matchReasons: ["Python expertise", "AWS experience", "Microservices knowledge"]
    },
    {
      id: '4',
      title: "React Developer",
      company: "Meta",
      location: "Menlo Park, CA",
      salary: "$140k - $200k",
      description: "Build user-facing web applications for billions of users. Focus on performance, accessibility, and user experience.",
      skills: ["React", "JavaScript", "GraphQL", "Redux", "CSS", "TypeScript", "Jest", "Next.js"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=react+developer&location=California&f_C=10667",
      matchScore: 88,
      matchReasons: ["Advanced React skills", "GraphQL experience", "Performance optimization"]
    },
    {
      id: '5',
      title: "Backend Developer",
      company: "Netflix",
      location: "Los Gatos, CA",
      salary: "$150k - $220k",
      description: "Design and implement scalable backend services. Work with microservices architecture and cloud technologies.",
      skills: ["Java", "Spring Boot", "AWS", "Docker", "Kafka", "PostgreSQL", "Redis", "Microservices"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=backend+developer&location=California&f_C=165158",
      matchScore: 76,
      matchReasons: ["Backend development experience", "Database knowledge", "API design"]
    },
    {
      id: '6',
      title: "DevOps Engineer",
      company: "Spotify",
      location: "New York, NY",
      salary: "$120k - $180k",
      description: "Manage CI/CD pipelines, infrastructure as code, and cloud deployments. Experience with Kubernetes and monitoring tools.",
      skills: ["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins", "Linux", "Python", "Ansible"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=devops+engineer&location=New+York&f_C=147195",
      matchScore: 81,
      matchReasons: ["DevOps tools experience", "Cloud infrastructure", "Automation skills"]
    },
    {
      id: '7',
      title: "Python Developer",
      company: "Tesla",
      location: "Austin, TX",
      salary: "$115k - $175k",
      description: "Develop Python applications for autonomous vehicle systems. Work with machine learning and data processing pipelines.",
      skills: ["Python", "Django", "Flask", "Machine Learning", "Pandas", "NumPy", "TensorFlow", "FastAPI"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=python+developer&location=Texas&f_C=4319",
      matchScore: 89,
      matchReasons: ["Python proficiency", "ML experience", "Data processing skills"]
    },
    {
      id: '8',
      title: "Mobile App Developer",
      company: "Apple",
      location: "Cupertino, CA",
      salary: "$130k - $200k",
      description: "Create innovative mobile applications for iOS devices. Experience with Swift and iOS development required.",
      skills: ["Swift", "iOS", "Xcode", "Objective-C", "UIKit", "Core Data", "SwiftUI", "React Native"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=ios+developer&location=California&f_C=162479",
      matchScore: 74,
      matchReasons: ["Mobile development experience", "iOS expertise", "App development"]
    },
    {
      id: '9',
      title: "Data Scientist",
      company: "Uber",
      location: "San Francisco, CA",
      salary: "$140k - $210k",
      description: "Analyze large datasets to improve ride-sharing algorithms and user experience. Strong statistical and machine learning skills required.",
      skills: ["Python", "R", "Machine Learning", "SQL", "Tableau", "Spark", "Hadoop", "Statistics"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=data+scientist&location=San+Francisco&f_C=1815218",
      matchScore: 91,
      matchReasons: ["Data science expertise", "ML algorithms", "Statistical analysis"]
    },
    {
      id: '10',
      title: "UI/UX Designer",
      company: "Adobe",
      location: "San Jose, CA",
      salary: "$100k - $160k",
      description: "Design intuitive user interfaces and experiences for creative software products. Proficiency in design tools required.",
      skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Wireframing", "Design Systems", "InVision"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.indeed.com/jobs?q=ui+ux+designer&l=California",
      matchScore: 67,
      matchReasons: ["Design tool proficiency", "UI/UX experience", "Prototyping skills"]
    },
    {
      id: '11',
      title: "Database Administrator",
      company: "Oracle",
      location: "Redwood City, CA",
      salary: "$110k - $170k",
      description: "Manage and optimize large-scale database systems. Experience with Oracle databases and performance tuning required.",
      skills: ["Oracle", "SQL", "PL/SQL", "Database Administration", "Performance Tuning", "Backup & Recovery", "MySQL", "PostgreSQL"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=database+administrator&location=California&f_C=1028",
      matchScore: 83,
      matchReasons: ["Database administration", "SQL expertise", "Performance tuning"]
    },
    {
      id: '12',
      title: "Security Engineer",
      company: "Cisco",
      location: "San Jose, CA",
      salary: "$125k - $185k",
      description: "Implement and maintain cybersecurity measures for enterprise networks. Knowledge of security protocols and threat analysis required.",
      skills: ["Cybersecurity", "Network Security", "Firewalls", "SIEM", "Penetration Testing", "Python", "Linux", "Ethical Hacking"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=security+engineer&location=California&f_C=1063",
      matchScore: 79,
      matchReasons: ["Security expertise", "Network knowledge", "Compliance experience"]
    },
    {
      id: '13',
      title: "Angular Developer",
      company: "IBM",
      location: "Austin, TX",
      salary: "$105k - $165k",
      description: "Develop enterprise applications using Angular framework. Experience with TypeScript and RxJS required.",
      skills: ["Angular", "TypeScript", "RxJS", "JavaScript", "HTML", "CSS", "Node.js", "Express"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.indeed.com/jobs?q=angular+developer&l=Texas",
      matchScore: 86,
      matchReasons: ["Angular expertise", "TypeScript skills", "Enterprise development"]
    },
    {
      id: '14',
      title: "Vue.js Developer",
      company: "GitLab",
      location: "Remote",
      salary: "$95k - $155k",
      description: "Build and maintain Vue.js applications for the GitLab platform. Experience with Vue ecosystem and testing frameworks.",
      skills: ["Vue.js", "JavaScript", "Vuex", "Nuxt.js", "Jest", "Cypress", "TypeScript", "GraphQL"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=vue+js+developer&f_WT=2&f_C=3808127",
      matchScore: 82,
      matchReasons: ["Vue.js proficiency", "JavaScript skills", "Testing experience"]
    },
    {
      id: '15',
      title: "Blockchain Developer",
      company: "Coinbase",
      location: "Remote",
      salary: "$135k - $195k",
      description: "Develop smart contracts and blockchain applications. Experience with Solidity and Web3 technologies required.",
      skills: ["Solidity", "Web3", "Ethereum", "Smart Contracts", "JavaScript", "React", "Node.js", "Truffle"],
      postedDate: new Date().toISOString(),
      applyUrl: "https://www.linkedin.com/jobs/search/?keywords=blockchain+developer&f_WT=2&f_C=11700",
      matchScore: 77,
      matchReasons: ["Blockchain experience", "Smart contract development", "Web3 knowledge"]
    }
  ];
}

module.exports = router;
