import { Mail, Phone, MapPin, Globe, Calendar } from 'lucide-react';

const ProfessionalTemplate = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8 shadow-lg" id="resume-template">
      {/* Header */}
      <div className="border-b-2 border-blue-600 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              {personalInfo.website}
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">Work Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index} className="border-l-2 border-blue-600 pl-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).getFullYear())}
                  </div>
                </div>
                <p className="text-blue-600 font-medium mb-2">{exp.company}</p>
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <div className="text-sm text-gray-600">
                    {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                  </div>
                </div>
                <p className="text-blue-600 font-medium">{edu.institution}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 border-b border-gray-300 pb-1 mb-3">Projects</h2>
          <div className="space-y-3">
            {projects.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                      View Project
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
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

export default ProfessionalTemplate;
