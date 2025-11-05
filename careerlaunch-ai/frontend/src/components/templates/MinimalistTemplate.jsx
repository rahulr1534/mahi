import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const MinimalistTemplate = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8" id="resume-template">
      {/* Header */}
      <div className="text-center mb-8 pb-6 border-b border-gray-200">
        <h1 className="text-4xl font-light text-gray-900 mb-4 tracking-wide">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.address && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{personalInfo.address}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed text-center max-w-2xl mx-auto italic">
            {summary}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Experience & Education */}
        <div className="md:col-span-2 space-y-8">
          {/* Experience */}
          {experience && experience.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6 uppercase tracking-wider border-b border-gray-200 pb-2">
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-medium text-gray-900">{exp.position}</h3>
                      <span className="text-sm text-gray-500 font-light">
                        {exp.startDate && new Date(exp.startDate).getFullYear()} — {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).getFullYear())}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 font-medium">{exp.company}</p>
                    {exp.description && (
                      <p className="text-gray-700 leading-relaxed text-sm">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6 uppercase tracking-wider border-b border-gray-200 pb-2">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-medium text-gray-900">{edu.degree} in {edu.field}</h3>
                      <span className="text-sm text-gray-500 font-light">
                        {edu.startDate && new Date(edu.startDate).getFullYear()} — {edu.endDate && new Date(edu.endDate).getFullYear()}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">{edu.institution}</p>
                    {edu.gpa && <p className="text-sm text-gray-500 mt-1">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6 uppercase tracking-wider border-b border-gray-200 pb-2">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 text-sm hover:text-gray-700 underline">
                          Link
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-gray-700 text-sm mb-2 leading-relaxed">{project.description}</p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
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

        {/* Right Column - Skills */}
        <div>
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-gray-900 mb-6 uppercase tracking-wider border-b border-gray-200 pb-2">
                Skills
              </h2>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div key={index} className="text-gray-700 text-sm">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinimalistTemplate;
