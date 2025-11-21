import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, Sparkles, Eye, ArrowLeft } from 'lucide-react';
import ResumePreview from '../components/ResumePreview';

const ResumeBuilder = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resumeId = searchParams.get('id');

  const [formData, setFormData] = useState({
    title: '',
    template: 'professional',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      website: ''
    },
    summary: '',
    experience: [{
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }],
    education: [{
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    }],
    skills: [''],
    projects: [{
      name: '',
      description: '',
      technologies: [''],
      link: ''
    }],
    certifications: [{
      name: '',
      issuer: '',
      date: '',
      credentialId: ''
    }],
    languages: [{
      language: '',
      proficiency: 'intermediate'
    }]
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (resumeId) {
      fetchResume();
    }
  }, [resumeId]);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/resumes/${resumeId}`);
      setFormData(response.data);
    } catch {
      setError('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (resumeId) {
        await axios.put(`${API_BASE_URL}/api/resumes/${resumeId}`, formData);
      } else {
        await axios.post(`${API_BASE_URL}/api/resumes`, formData);
      }
      navigate('/dashboard');
    } catch {
      setError('Failed to save resume');
    } finally {
      setSaving(false);
    }
  };

  const generateAIContent = async () => {
    try {
      setError('');
      const response = await axios.post(`${API_BASE_URL}/api/resumes/generate`, {
        prompt: 'Generate professional resume content',
        template: formData.template,
        experience: formData.experience,
        skills: formData.skills,
        education: formData.education,
        targetRole: formData.title || 'Professional Role'
      });

      const aiContent = response.data;

      // Show success message
      setError(''); // Clear any previous errors

      // Update form data with AI-generated content
      setFormData(prev => ({
        ...prev,
        summary: aiContent.summary || prev.summary,
        skills: aiContent.skills || prev.skills
      }));

      // Show AI suggestions if provided
      if (aiContent.suggestions) {
        // You could show this in a toast notification or modal
        console.log('AI Suggestions:', aiContent.suggestions);
      }
    } catch (error) {
      console.error('AI generation error:', error);
      setError('AI generation failed. Please try again or add your OpenAI API key.');
    }
  };

  const updatePersonalInfo = (field, value) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const updateSkill = (index, value) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-white mb-2">
          {resumeId ? 'Edit Resume' : 'Create New Resume'}
        </h1>
        <p className="text-gray-400">Build your professional resume with AI assistance</p>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Resume Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Software Developer Resume"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Template
              </label>
              <select
                value={formData.template}
                onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
                <option value="atsfriendly">ATS-Friendly</option>
                <option value="tech">Tech-Focused</option>
                <option value="creative">Creative</option>
                <option value="minimalist">Minimalist</option>
              </select>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">Personal Information</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={formData.personalInfo.fullName}
                onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                value={formData.personalInfo.address}
                onChange={(e) => updatePersonalInfo('address', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Professional Summary</h2>
            <button
              type="button"
              onClick={generateAIContent}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate with AI
            </button>
          </div>

          <textarea
            value={formData.summary}
            onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write a brief summary of your professional background and career goals..."
          />
        </div>

        {/* Skills */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Skills</h2>
            <button
              type="button"
              onClick={addSkill}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Skill
            </button>
          </div>

          <div className="space-y-2">
            {formData.skills.map((skill, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(index, e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter a skill"
                />
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Work Experience</h2>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                experience: [...prev.experience, {
                  company: '',
                  position: '',
                  startDate: '',
                  endDate: '',
                  current: false,
                  description: ''
                }]
              }))}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Experience
            </button>
          </div>

          <div className="space-y-6">
            {formData.experience.map((exp, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].company = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Position/Title"
                    value={exp.position}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].position = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={exp.startDate}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].startDate = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="month"
                    placeholder="End Date"
                    value={exp.endDate}
                    onChange={(e) => {
                      const newExp = [...formData.experience];
                      newExp[index].endDate = e.target.value;
                      setFormData(prev => ({ ...prev, experience: newExp }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={exp.current}
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => {
                        const newExp = [...formData.experience];
                        newExp[index].current = e.target.checked;
                        if (e.target.checked) newExp[index].endDate = '';
                        setFormData(prev => ({ ...prev, experience: newExp }));
                      }}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Current Position</span>
                  </label>
                </div>

                <textarea
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...formData.experience];
                    newExp[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, experience: newExp }));
                  }}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {formData.experience.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        experience: prev.experience.filter((_, i) => i !== index)
                      }));
                    }}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Education</h2>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                education: [...prev.education, {
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: '',
                  endDate: '',
                  gpa: ''
                }]
              }))}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Education
            </button>
          </div>

          <div className="space-y-6">
            {formData.education.map((edu, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Institution Name"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].institution = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Degree (e.g., Bachelor's)"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].degree = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={edu.field}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].field = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="month"
                    placeholder="Start Date"
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].startDate = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="month"
                    placeholder="End Date"
                    value={edu.endDate}
                    onChange={(e) => {
                      const newEdu = [...formData.education];
                      newEdu[index].endDate = e.target.value;
                      setFormData(prev => ({ ...prev, education: newEdu }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <input
                  type="text"
                  placeholder="GPA (optional)"
                  value={edu.gpa}
                  onChange={(e) => {
                    const newEdu = [...formData.education];
                    newEdu[index].gpa = e.target.value;
                    setFormData(prev => ({ ...prev, education: newEdu }));
                  }}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                {formData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        education: prev.education.filter((_, i) => i !== index)
                      }));
                    }}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Projects</h2>
            <button
              type="button"
              onClick={() => setFormData(prev => ({
                ...prev,
                projects: [...prev.projects, {
                  name: '',
                  description: '',
                  technologies: [''],
                  link: ''
                }]
              }))}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Add Project
            </button>
          </div>

          <div className="space-y-6">
            {formData.projects.map((project, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={project.name}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index].name = e.target.value;
                      setFormData(prev => ({ ...prev, projects: newProjects }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="url"
                    placeholder="Project Link (optional)"
                    value={project.link}
                    onChange={(e) => {
                      const newProjects = [...formData.projects];
                      newProjects[index].link = e.target.value;
                      setFormData(prev => ({ ...prev, projects: newProjects }));
                    }}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <textarea
                  placeholder="Project description..."
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...formData.projects];
                    newProjects[index].description = e.target.value;
                    setFormData(prev => ({ ...prev, projects: newProjects }));
                  }}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                />

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <input
                      key={techIndex}
                      type="text"
                      placeholder="Technology"
                      value={tech}
                      onChange={(e) => {
                        const newProjects = [...formData.projects];
                        newProjects[index].technologies[techIndex] = e.target.value;
                        setFormData(prev => ({ ...prev, projects: newProjects }));
                      }}
                      className="px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newProjects = [...formData.projects];
                      newProjects[index].technologies.push('');
                      setFormData(prev => ({ ...prev, projects: newProjects }));
                    }}
                    className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    +
                  </button>
                </div>

                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        projects: prev.projects.filter((_, i) => i !== index)
                      }));
                    }}
                    className="mt-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm"
                  >
                    Remove Project
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-700">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className="px-6 py-3 border border-blue-600 text-blue-400 rounded-md hover:bg-blue-600 hover:text-white flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </div>
      </form>

      {/* Resume Preview Modal */}
      {showPreview && (
        <ResumePreview
          resumeData={formData}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default ResumeBuilder;
