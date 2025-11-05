import { Mail, Phone, MapPin, Globe, Calendar, FileText } from 'lucide-react';

const ATSFriendlyTemplate = ({ resumeData }) => {
  const { personalInfo, summary, experience, education, skills, projects } = resumeData;

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 font-sans" id="resume-template" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header - Clean and Simple for ATS */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-black mb-2" style={{ fontSize: '24pt' }}>{personalInfo.fullName}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-black">
          {personalInfo.email && (
            <span>{personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span>{personalInfo.phone}</span>
          )}
          {personalInfo.address && (
            <span>{personalInfo.address}</span>
          )}
          {personalInfo.website && (
            <span>{personalInfo.website}</span>
          )}
        </div>
      </div>

      {/* Professional Summary - Keyword Rich */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-3 uppercase" style={{ fontSize: '14pt' }}>Professional Summary</h2>
          <p className="text-black leading-relaxed" style={{ fontSize: '11pt', lineHeight: '1.4' }}>{summary}</p>
        </div>
      )}

      {/* Core Competencies / Skills - ATS Optimized */}
      {skills && skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-3 uppercase" style={{ fontSize: '14pt' }}>Core Competencies</h2>
          <div className="grid grid-cols-3 gap-2">
            {skills.map((skill, index) => (
              <div key={index} className="text-black font-medium" style={{ fontSize: '11pt' }}>
                • {skill}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Professional Experience - ATS Friendly Format */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-4 uppercase" style={{ fontSize: '14pt' }}>Professional Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="mb-2">
                  <h3 className="text-lg font-bold text-black" style={{ fontSize: '12pt' }}>{exp.position}</h3>
                  <p className="text-black font-medium" style={{ fontSize: '12pt' }}>{exp.company}</p>
                  <p className="text-black" style={{ fontSize: '11pt' }}>
                    {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })} - {' '}
                    {exp.current ? 'Present' : (exp.endDate && new Date(exp.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }))}
                  </p>
                </div>
                {exp.description && (
                  <div className="ml-4">
                    <p className="text-black leading-relaxed" style={{ fontSize: '11pt', lineHeight: '1.4' }}>{exp.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education - Simple ATS Format */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-4 uppercase" style={{ fontSize: '14pt' }}>Education</h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-black" style={{ fontSize: '12pt' }}>{edu.degree} in {edu.field}</h3>
                <p className="text-black font-medium" style={{ fontSize: '12pt' }}>{edu.institution}</p>
                <p className="text-black" style={{ fontSize: '11pt' }}>
                  {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                  {edu.gpa && `, GPA: ${edu.gpa}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Projects - ATS Optimized */}
      {projects && projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold text-black mb-4 uppercase" style={{ fontSize: '14pt' }}>Technical Projects</h2>
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-black mb-1" style={{ fontSize: '12pt' }}>{project.name}</h3>
                {project.description && (
                  <p className="text-black mb-2" style={{ fontSize: '11pt', lineHeight: '1.4' }}>{project.description}</p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <p className="text-black" style={{ fontSize: '11pt' }}>
                    <strong>Technologies:</strong> {project.technologies.join(', ')}
                  </p>
                )}
                {project.link && (
                  <p className="text-black" style={{ fontSize: '11pt' }}>
                    <strong>Link:</strong> {project.link}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications/Achievements Section (if needed) */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <p className="text-xs text-gray-600" style={{ fontSize: '9pt' }}>
          This resume is optimized for Applicant Tracking Systems (ATS) and contains relevant keywords for software engineering positions.
        </p>
      </div>
    </div>
  );
};

export default ATSFriendlyTemplate;
