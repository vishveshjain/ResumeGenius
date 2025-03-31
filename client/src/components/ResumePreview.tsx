import { useRef } from "react";
import { BasicInfo, Education, Experience, Resume } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { generateResumePdf } from "@/lib/pdf-utils";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumePreviewProps {
  basicInfo: BasicInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  summary?: string;
  templateId?: string;
  onExport?: () => void;
}

export default function ResumePreview({
  basicInfo,
  experiences,
  education,
  skills,
  summary,
  templateId = "professional",
  onExport,
}: ResumePreviewProps) {
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!resumeRef.current) return;

    try {
      const resumeData: Partial<Resume> = {
        title: `${basicInfo.name}_resume`,
        basicInfo,
        experiences,
        education,
        skills,
        summary,
        templateId,
      };

      await generateResumePdf(resumeRef.current, resumeData as Resume);
      if (onExport) onExport();
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <div>
      <div className="mb-6 border-b pb-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold font-open-sans mb-1">Resume Preview</h2>
          <p className="text-gray-600 text-sm">
            See how your resume will appear to employers and ATS systems
          </p>
        </div>
        <div>
          <Button
            onClick={handleExport}
            className="bg-accent text-white hover:bg-accent/90"
          >
            <Download className="mr-1 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <div className="overflow-auto max-h-[800px] border border-gray-200 rounded-md">
        <div ref={resumeRef} className="resume-paper">
          {/* Resume Header */}
          <div className="mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold text-primary mb-1">
              {basicInfo.name || "Your Name"}
            </h1>
            <p className="text-gray-600">{basicInfo.title || "Your Title"}</p>
            <div className="flex flex-wrap mt-2 text-sm text-gray-700">
              {basicInfo.email && (
                <span className="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {basicInfo.email}
                </span>
              )}
              {basicInfo.phone && (
                <span className="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {basicInfo.phone}
                </span>
              )}
              {basicInfo.location && (
                <span className="mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {basicInfo.location}
                </span>
              )}
              {basicInfo.linkedin && (
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="inline-block h-4 w-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  {basicInfo.linkedin}
                </span>
              )}
            </div>
          </div>

          {/* Professional Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primary mb-2">
                Professional Summary
              </h2>
              <p className="text-gray-700">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {experiences.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primary mb-2">Work Experience</h2>

              {experiences.map((experience, index) => (
                <div key={experience.id || index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{experience.jobTitle}</h3>
                    <span className="text-gray-600 text-sm">
                      {experience.startDate} - {experience.isCurrentJob ? "Present" : experience.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 italic mb-2">
                    {experience.companyName}
                    {experience.isSimulated && (
                      <span className="ml-2 text-xs text-accent">(Simulated)</span>
                    )}
                  </p>
                  <div className="text-gray-700 text-sm space-y-1">
                    {experience.description.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-1">• {paragraph}</p>
                    ))}
                  </div>
                  
                  {experience.keySkills && experience.keySkills.length > 0 && (
                    <div className="mt-2">
                      <span className="text-sm font-medium">Skills: </span>
                      <span className="text-sm text-gray-600">
                        {experience.keySkills.join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-primary mb-2">Education</h2>
              {education.map((edu, index) => (
                <div key={edu.id || index}>
                  <div className="flex justify-between mb-1">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <span className="text-gray-600 text-sm">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  <p className="text-gray-600 italic">
                    {edu.institution} {edu.fieldOfStudy && `- ${edu.fieldOfStudy}`}
                  </p>
                  {edu.description && (
                    <p className="text-gray-700 text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-primary mb-2">Skills</h2>
              <div className="flex flex-wrap">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-gray-100 text-gray-800 rounded-md px-3 py-1 text-sm mr-2 mb-2"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
