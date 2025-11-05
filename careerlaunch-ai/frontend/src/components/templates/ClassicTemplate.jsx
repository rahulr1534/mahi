import { Mail, Phone, MapPin, Globe, Calendar, Award, Briefcase } from 'lucide-react';

const ClassicTemplate = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 p-8 shadow-lg font-serif" id="resume-template">
      {/* Header - Traditional Style */}
      <div className="text-center border-b-2 border-gray-800 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-wide">{personalInfo.fullName}</h1>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-700 mb-4">
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

      {/* Professional Summary */}
      {summary && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2 mb-4">
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed text-justify indent-8">{summary}</p>
        </div>
      )}

      {/* Professional Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2 mb-6">
            Professional Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-gray-700 font-medium italic">{exp.company}</p>
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - {' '}
                    {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }))}
                  </div>
                </div>
                {exp.description && (
                  <div className="ml-4">
                    <p className="text-gray-700 leading-relaxed text-justify">{exp.description}</p>
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
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2 mb-6">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-gray-700 font-medium">{edu.institution}</p>
                  {edu.gpa && <p className="text-sm text-gray-600">Grade Point Average: {edu.gpa}</p>}
                </div>
                <div className="text-sm text-gray-600 font-medium text-right">
                  {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Skills */}
      {skills && skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2 mb-4">
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700 font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Projects */}
      {projects && projects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wider border-b border-gray-400 pb-2 mb-6">
            Professional Projects
          </h2>
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={index} className="border-l-2 border-gray-400 pl-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">
                      Project Link
                    </a>
                  )}
                </div>
                {project.description && (
                  <p className="text-gray-700 leading-relaxed mb-3 text-justify">{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600 font-medium">Technologies:</span>
                    {project.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
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

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-12 pt-4 border-t border-gray-300">
        <p>This resume was generated professionally for career advancement opportunities.</p>
      </div>
    </div>
  );
};

export default ClassicTemplate;
