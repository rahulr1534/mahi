import { Mail, Phone, MapPin, Globe, Calendar, Github, Linkedin, Code2, Cpu, Database, Cloud, Zap, GraduationCap, Briefcase } from 'lucide-react';

const TechTemplate = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  // Categorize skills
  const skillCategories = {
    'Programming Languages': skills?.filter(skill =>
      ['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'scala', 'r'].includes(skill.toLowerCase())
    ) || [],
    'Web Technologies': skills?.filter(skill =>
      ['react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'html', 'css', 'sass', 'webpack', 'babel'].includes(skill.toLowerCase())
    ) || [],
    'Databases': skills?.filter(skill =>
      ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sql server', 'dynamodb'].includes(skill.toLowerCase())
    ) || [],
    'Cloud & DevOps': skills?.filter(skill =>
      ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'linux', 'git', 'ci/cd'].includes(skill.toLowerCase())
    ) || [],
    'Data Science & ML': skills?.filter(skill =>
      ['pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'machine learning', 'data science', 'tableau'].includes(skill.toLowerCase())
    ) || [],
    'Other': skills?.filter(skill =>
      !['javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift', 'kotlin', 'typescript', 'scala', 'r',
        'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'html', 'css', 'sass', 'webpack', 'babel',
        'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle', 'sql server', 'dynamodb',
        'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible', 'linux', 'git', 'ci/cd',
        'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'machine learning', 'data science', 'tableau'].includes(skill.toLowerCase())
    ) || []
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-900 text-white p-8 shadow-2xl" id="resume-template">
      {/* Tech Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 p-8 rounded-lg mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">{personalInfo.fullName}</h1>
              <p className="text-cyan-200 text-lg">Software Engineer</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-cyan-300" />
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-cyan-300" />
              <span>{personalInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-300" />
              <span>{personalInfo.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-300" />
              <span>{personalInfo.website}</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-4">
            {personalInfo.github && (
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-300 hover:text-white transition-colors">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cyan-300 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-10">
          <Cpu className="h-12 w-12" />
        </div>
        <div className="absolute bottom-4 right-8 opacity-10">
          <Database className="h-8 w-8" />
        </div>
      </div>

      {/* Tech Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Zap className="h-6 w-6 text-cyan-400 mr-3" />
            Tech Summary
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-300 leading-relaxed">{summary}</p>
          </div>
        </div>
      )}

      {/* Technical Skills Matrix */}
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Code2 className="h-6 w-6 text-green-400 mr-3" />
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(skillCategories).map(([category, categorySkills]) => (
              categorySkills.length > 0 && (
                <div key={category} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center">
                    {category === 'Programming Languages' && <Code2 className="h-4 w-4 mr-2" />}
                    {category === 'Web Technologies' && <Globe className="h-4 w-4 mr-2" />}
                    {category === 'Databases' && <Database className="h-4 w-4 mr-2" />}
                    {category === 'Cloud & DevOps' && <Cloud className="h-4 w-4 mr-2" />}
                    {category === 'Data Science & ML' && <Cpu className="h-4 w-4 mr-2" />}
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, index) => (
                      <span key={index} className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Briefcase className="h-6 w-6 text-purple-400 mr-3" />
            Engineering Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{exp.position}</h3>
                    <p className="text-purple-400 font-medium text-lg">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-400 bg-gray-700 px-3 py-1 rounded-full">
                    {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).getFullYear())}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-300 leading-relaxed mb-3">{exp.description}</p>
                )}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-400 mr-2">Tech Stack:</span>
                    {exp.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-gray-700 text-cyan-300 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Github className="h-6 w-6 text-orange-400 mr-3" />
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-orange-500 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 text-sm">
                      <Github className="h-4 w-4" />
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-300 mb-3 text-sm">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-orange-900 bg-opacity-50 text-orange-300 px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <GraduationCap className="h-6 w-6 text-green-400 mr-3" />
            Education
          </h2>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{edu.degree} in {edu.field}</h3>
                    <p className="text-green-400 font-medium">{edu.institution}</p>
                  </div>
                  <div className="text-sm text-gray-400">
                    {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechTemplate;
