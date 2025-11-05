import { useState } from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ProfessionalTemplate from './templates/ProfessionalTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ModernTemplate from './templates/ModernTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import ATSFriendlyTemplate from './templates/ATSFriendlyTemplate';
import TechTemplate from './templates/TechTemplate';

const ResumePreview = ({ resumeData, onClose }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(resumeData.template || 'professional');

  const getTemplateComponent = (template) => {
    switch (template) {
      case 'modern':
        return ModernTemplate;
      case 'classic':
        return ClassicTemplate;
      case 'atsfriendly':
        return ATSFriendlyTemplate;
      case 'tech':
        return TechTemplate;
      case 'creative':
        return CreativeTemplate;
      case 'minimalist':
        return MinimalistTemplate;
      default:
        return ProfessionalTemplate;
    }
  };

  const downloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      console.log('Starting PDF generation...');

      // Create a simple HTML version for better PDF generation
      const htmlContent = generateSimpleHTML();

      // Create a temporary element to capture
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.color = '#333';
      document.body.appendChild(tempDiv);

      // Wait for fonts and styles to load
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create canvas from the temporary element
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 800,
        height: tempDiv.offsetHeight,
        logging: false
      });

      // Remove temporary element
      document.body.removeChild(tempDiv);

      console.log('Canvas created:', canvas.width, 'x', canvas.height);

      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error('Failed to capture resume content');
      }

      // Calculate PDF dimensions
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      console.log('PDF dimensions:', imgWidth, 'x', imgHeight);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png', 1.0);

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

      // Generate filename
      const fileName = `${(resumeData.personalInfo?.fullName || 'Resume').replace(/\s+/g, '_')}_${selectedTemplate}.pdf`;

      console.log('Saving PDF as:', fileName);

      // Download the PDF
      pdf.save(fileName);

      console.log('PDF download completed successfully');
      alert('PDF downloaded successfully! Check your browser\'s downloads folder (usually Desktop or Downloads).');

    } catch (error) {
      console.error('PDF generation failed:', error);
      alert(`Failed to generate PDF: ${error.message}. Please try again.`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateSimpleHTML = () => {
    const { personalInfo, summary, experience, education, skills, projects } = resumeData;

    return `
      <div style="max-width: 600px; margin: 0 auto; padding: 40px; background: white; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #2563eb;">
          <h1 style="font-size: 28px; margin: 0; color: #1f2937;">${personalInfo?.fullName || 'Your Name'}</h1>
          <div style="margin-top: 10px; font-size: 14px; color: #6b7280;">
            ${personalInfo?.email ? `<div>${personalInfo.email}</div>` : ''}
            ${personalInfo?.phone ? `<div>${personalInfo.phone}</div>` : ''}
            ${personalInfo?.address ? `<div>${personalInfo.address}</div>` : ''}
          </div>
        </div>

        <!-- Summary -->
        ${summary ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #2563eb; margin-bottom: 10px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Professional Summary</h2>
            <p style="margin: 0; text-align: justify;">${summary}</p>
          </div>
        ` : ''}

        <!-- Experience -->
        ${experience && experience.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Work Experience</h2>
            ${experience.map(exp => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                  <h3 style="font-size: 16px; margin: 0; color: #1f2937;">${exp.position || 'Position'}</h3>
                  <span style="font-size: 14px; color: #6b7280;">
                    ${exp.startDate ? new Date(exp.startDate).getFullYear() : ''} -
                    ${exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                  </span>
                </div>
                <p style="margin: 5px 0; color: #2563eb; font-weight: 500;">${exp.company || 'Company'}</p>
                ${exp.description ? `<p style="margin: 10px 0; text-align: justify; font-size: 14px;">${exp.description}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Education -->
        ${education && education.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Education</h2>
            ${education.map(edu => `
              <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                  <h3 style="font-size: 16px; margin: 0; color: #1f2937;">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                  <span style="font-size: 14px; color: #6b7280;">
                    ${edu.startDate ? new Date(edu.startDate).getFullYear() : ''} -
                    ${edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                  </span>
                </div>
                <p style="margin: 5px 0; color: #2563eb; font-weight: 500;">${edu.institution || 'Institution'}</p>
                ${edu.gpa ? `<p style="margin: 5px 0; font-size: 14px; color: #6b7280;">GPA: ${edu.gpa}</p>` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Skills -->
        ${skills && skills.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Skills</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${skills.map(skill => `
                <span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 14px;">${skill}</span>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Projects -->
        ${projects && projects.length > 0 ? `
          <div style="margin-bottom: 30px;">
            <h2 style="font-size: 18px; color: #2563eb; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px;">Projects</h2>
            ${projects.map(project => `
              <div style="margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 5px;">
                  <h3 style="font-size: 16px; margin: 0; color: #1f2937;">${project.name || 'Project Name'}</h3>
                  ${project.link ? `<a href="${project.link}" style="color: #2563eb; text-decoration: none; font-size: 14px;">View Project</a>` : ''}
                </div>
                ${project.description ? `<p style="margin: 8px 0; text-align: justify; font-size: 14px;">${project.description}</p>` : ''}
                ${project.technologies && project.technologies.length > 0 ? `
                  <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px;">
                    ${project.technologies.map(tech => `
                      <span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${tech}</span>
                    `).join('')}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
    `;
  };

  const TemplateComponent = getTemplateComponent(selectedTemplate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Resume Preview</h2>
            <div className="flex gap-3">
              <button
                onClick={downloadPDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="h-4 w-4" />
                {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
              </button>
              <button
                onClick={onClose}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <EyeOff className="h-4 w-4" />
                Close Preview
              </button>
            </div>
          </div>

          {/* Template Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            <span className="text-gray-300 text-sm mr-2 col-span-2 md:col-span-1">Template:</span>
            <button
              onClick={() => setSelectedTemplate('professional')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTemplate === 'professional'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Professional
            </button>
            <button
              onClick={() => setSelectedTemplate('modern')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTemplate === 'modern'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Modern
            </button>
            <button
              onClick={() => setSelectedTemplate('classic')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTemplate === 'classic'
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => setSelectedTemplate('atsfriendly')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTemplate === 'atsfriendly'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ATS-Friendly
            </button>
            <button
              onClick={() => setSelectedTemplate('tech')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTemplate === 'tech'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Tech-Focused
            </button>
            <button
              onClick={() => setSelectedTemplate('creative')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTemplate === 'creative'
                  ? 'bg-pink-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Creative
            </button>
            <button
              onClick={() => setSelectedTemplate('minimalist')}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedTemplate === 'minimalist'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Minimalist
            </button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="overflow-auto max-h-[calc(90vh-80px)] bg-gray-100">
          <div className="p-8">
            <TemplateComponent resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
