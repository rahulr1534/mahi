import { Mail, Phone, MapPin, Globe, Calendar, Star } from 'lucide-react';

const CreativeTemplate = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 to-pink-50 text-gray-900 p-8 shadow-lg" id="resume-template">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">
            {personalInfo.fullName?.charAt(0)?.toUpperCase()}
          </span>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          {personalInfo.fullName}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-purple-500" />
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-purple-500" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-purple-500" />
              {personalInfo.address}
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4 text-purple-500" />
              {personalInfo.website}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 border-l-4 border-purple-500">
          <h2 className="text-xl font-semibold text-purple-600 mb-3 flex items-center gap-2">
            <Star className="h-5 w-5" />
            About Me
          </h2>
          <p className="text-gray-700 leading-relaxed italic">{summary}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Experience */}
        {experience && experience.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-pink-500">
            <h2 className="text-xl font-semibold text-pink-600 mb-4 flex items-center gap-2">
              💼 Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                    <div className="text-sm text-purple-600 bg-purple-100 px-2 py-1 rounded">
                      {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).getFullYear())}
                    </div>
                  </div>
                  <p className="text-pink-600 font-medium mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-green-500">
            <h2 className="text-xl font-semibold text-green-600 mb-4 flex items-center gap-2">
              🎓 Education
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-green-600 font-medium mb-1">{edu.institution}</p>
                  <div className="text-sm text-gray-600 mb-2">
                    {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6 border-l-4 border-blue-500">
          <h2 className="text-xl font-semibold text-blue-600 mb-4 flex items-center gap-2">
            🚀 Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {skills.map((skill, index) => (
              <span key={index} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border-l-4 border-orange-500">
          <h2 className="text-xl font-semibold text-orange-600 mb-4 flex items-center gap-2">
            💡 Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project, index) => (
              <div key={index} className="bg-gradient-to-r from-orange-50 to-pink-50 p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-orange-600 text-sm hover:underline">
                      🔗 Link
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-700 text-sm mb-3">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">
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

export default CreativeTemplate;
