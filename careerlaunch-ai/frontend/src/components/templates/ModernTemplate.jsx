import { Mail, Phone, MapPin, Globe, Calendar, Github, Linkedin, Code } from 'lucide-react';

const ModernTemplate = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900 p-8 shadow-xl" id="resume-template">
      {/* Header with Modern Design */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-t-lg mb-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Code className="h-12 w-12" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{personalInfo.fullName}</h1>
            <div className="flex flex-wrap gap-4 text-sm opacity-90">
              {personalInfo.email && (
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {personalInfo.email}
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {personalInfo.address}
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-3">
              {personalInfo.website && (
                <a href={personalInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-80">
                  <Globe className="h-4 w-4" />
                  Portfolio
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-80">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              )}
              {personalInfo.github && (
                <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:opacity-80">
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-8 bg-blue-600 mr-3"></div>
            About Me
          </h2>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-8 bg-green-600 mr-3"></div>
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-600">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                    <p className="text-green-600 font-medium text-lg">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).getFullYear())}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills & Education Side by Side */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Skills */}
        {skills && skills.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-1 h-8 bg-purple-600 mr-3"></div>
              Technical Skills
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <div key={index} className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-4 py-2 rounded-lg text-sm font-medium text-center">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-1 h-8 bg-orange-600 mr-3"></div>
              Education
            </h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                    <p className="text-orange-600 font-medium">{edu.institution}</p>
                    <p className="text-sm text-gray-600">
                      {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                      {edu.gpa && ` • GPA: ${edu.gpa}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <div className="w-1 h-8 bg-red-600 mr-3"></div>
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-red-600">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 text-sm font-medium">
                      View Live →
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-700 mb-3">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">
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
    </div>
  );
};

export default ModernTemplate;
