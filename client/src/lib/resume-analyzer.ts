import { Resume, Experience } from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';

export function analyzeResumeAgainstKeywords(resume: Partial<Resume>, keywords: string[]): {
  score: number;
  matchedKeywords: string[];
  missedKeywords: string[];
} {
  // Extract all content from the resume
  const resumeContent = getResumeContent(resume);
  
  // Calculate matches
  const matchedKeywords: string[] = [];
  const missedKeywords: string[] = [];
  
  // Check each keyword
  keywords.forEach(keyword => {
    if (resumeContent.toLowerCase().includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    } else {
      missedKeywords.push(keyword);
    }
  });
  
  // Calculate score as a percentage of matched keywords
  const score = keywords.length > 0 
    ? Math.round((matchedKeywords.length / keywords.length) * 100) 
    : 0;
  
  return {
    score,
    matchedKeywords,
    missedKeywords
  };
}

function getResumeContent(resume: Partial<Resume>): string {
  const parts: string[] = [];
  
  // Add basic info
  if (resume.basicInfo) {
    parts.push(
      resume.basicInfo.name,
      resume.basicInfo.title,
      resume.basicInfo.email,
      resume.basicInfo.location
    );
  }
  
  // Add summary
  if (resume.summary) {
    parts.push(resume.summary);
  }
  
  // Add experiences
  if (resume.experiences) {
    resume.experiences.forEach(exp => {
      parts.push(
        exp.companyName,
        exp.jobTitle,
        exp.description,
        ...(exp.keySkills || [])
      );
    });
  }
  
  // Add education
  if (resume.education) {
    resume.education.forEach(edu => {
      parts.push(
        edu.institution,
        edu.degree,
        edu.fieldOfStudy || '',
        edu.description || ''
      );
    });
  }
  
  // Add skills
  if (resume.skills) {
    parts.push(...resume.skills);
  }
  
  return parts.filter(Boolean).join(' ');
}

export function generateResumeSuggestions(resume: Partial<Resume>, keywords: string[]): string[] {
  const suggestions: string[] = [];
  const analysis = analyzeResumeAgainstKeywords(resume, keywords);
  
  if (analysis.missedKeywords.length > 0) {
    suggestions.push(
      `Consider adding the following keywords to your resume: ${analysis.missedKeywords.join(', ')}.`
    );
  }
  
  if (!resume.summary || resume.summary.length < 50) {
    suggestions.push(
      'Add a strong professional summary that includes relevant keywords from the job description.'
    );
  }
  
  if (!resume.skills || resume.skills.length < 5) {
    suggestions.push(
      'List more relevant skills, especially those mentioned in the job description.'
    );
  }
  
  if (!resume.experiences || resume.experiences.length === 0) {
    suggestions.push(
      'Add work experiences to demonstrate your qualifications for this role.'
    );
  } else {
    // Check if experiences include the keywords
    const experienceContent = resume.experiences
      .map(exp => `${exp.jobTitle} ${exp.description} ${exp.keySkills?.join(' ')}`)
      .join(' ')
      .toLowerCase();
    
    const missingInExperience = analysis.missedKeywords.filter(
      keyword => !experienceContent.includes(keyword.toLowerCase())
    );
    
    if (missingInExperience.length > 0) {
      suggestions.push(
        `Update your work experience descriptions to include these keywords: ${missingInExperience.join(', ')}.`
      );
    }
  }
  
  return suggestions;
}

export function generateSimulatedExperience(jobTitle: string, keywords: string[]): Experience {
  // Sample job titles and descriptions for various roles
  const jobTemplates: { [key: string]: string[] } = {
    developer: [
      "Developed and maintained web applications using %TECH_STACK%.",
      "Collaborated with cross-functional teams to design and implement new features.",
      "Improved application performance by %PERCENT% through code optimization.",
      "Implemented automated testing procedures, increasing code coverage by %PERCENT%.",
      "Participated in code reviews and provided constructive feedback to team members."
    ],
    manager: [
      "Led a team of %NUMBER% professionals, overseeing project delivery and team performance.",
      "Implemented %PROCESS% methodologies, improving project delivery times by %PERCENT%.",
      "Managed relationships with key stakeholders and clients to ensure project success.",
      "Developed and executed strategic plans aligned with organizational objectives.",
      "Conducted performance reviews and provided mentorship to team members."
    ],
    analyst: [
      "Analyzed complex data sets using %TECH_STACK% to derive actionable insights.",
      "Created comprehensive reports and dashboards to track key performance indicators.",
      "Conducted research and provided recommendations to improve business processes.",
      "Collaborated with stakeholders to define requirements and develop solutions.",
      "Implemented data validation procedures to ensure data integrity."
    ]
  };
  
  // Determine the job category
  let category = 'developer';
  if (jobTitle.toLowerCase().includes('manager') || jobTitle.toLowerCase().includes('director')) {
    category = 'manager';
  } else if (jobTitle.toLowerCase().includes('analyst') || jobTitle.toLowerCase().includes('data')) {
    category = 'analyst';
  }
  
  // Generate a description with keywords
  const description = generateDescriptionWithKeywords(jobTitle, keywords);
  
  // Create a simulated experience
  return {
    id: uuidv4(),
    companyName: "Example Corporation",
    jobTitle: jobTitle,
    startDate: "2021-01",
    endDate: "2023-01",
    isCurrentJob: false,
    description: description,
    keySkills: shuffleArray([...keywords]).slice(0, Math.min(5, keywords.length)),
    isSimulated: true
  };
}

function generateDescriptionWithKeywords(jobTitle: string, keywords: string[]): string {
  // Base template sentences
  const templates = [
    "Implemented %KEYWORD1% solutions to improve business processes.",
    "Developed %KEYWORD2% strategies resulting in increased efficiency.",
    "Utilized %KEYWORD3% to analyze and optimize workflows.",
    "Collaborated with cross-functional teams on %KEYWORD4% initiatives.",
    "Managed %KEYWORD5% projects from conception to delivery."
  ];
  
  // Replace placeholders with actual keywords
  const filledTemplates = templates.map((template, index) => {
    const keywordIndex = index % keywords.length;
    return template.replace(`%KEYWORD${index + 1}%`, keywords[keywordIndex] || "industry-standard");
  });
  
  // Create a cohesive paragraph
  return filledTemplates.join(' ');
}

function shuffleArray(array: any[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}