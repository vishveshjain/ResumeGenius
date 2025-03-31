import { Experience, Resume } from '@shared/schema';

// Analyzes a resume against job description keywords
export function analyzeResumeAgainstKeywords(resume: Partial<Resume>, keywords: string[]): {
  score: number;
  missingKeywords: string[];
  presentKeywords: string[];
} {
  if (!keywords.length) {
    return { score: 0, missingKeywords: [], presentKeywords: [] };
  }

  // Get all text content from resume
  const allResumeContent = getResumeContent(resume);
  
  // Check which keywords are present in the resume
  const presentKeywords: string[] = [];
  const missingKeywords: string[] = [];
  
  keywords.forEach(keyword => {
    if (allResumeContent.toLowerCase().includes(keyword.toLowerCase())) {
      presentKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });
  
  // Calculate score as percentage of keywords present
  const score = Math.round((presentKeywords.length / keywords.length) * 100);
  
  return {
    score,
    missingKeywords,
    presentKeywords
  };
}

// Extracts all textual content from resume for analysis
function getResumeContent(resume: Partial<Resume>): string {
  const parts: string[] = [];
  
  // Add basic info
  if (resume.basicInfo) {
    parts.push(resume.basicInfo.name || '');
    parts.push(resume.basicInfo.title || '');
    parts.push(resume.basicInfo.location || '');
  }
  
  // Add summary
  if (resume.summary) {
    parts.push(resume.summary);
  }
  
  // Add experiences
  if (resume.experiences) {
    resume.experiences.forEach(exp => {
      parts.push(exp.companyName || '');
      parts.push(exp.jobTitle || '');
      parts.push(exp.description || '');
      if (exp.keySkills) {
        parts.push(exp.keySkills.join(' '));
      }
    });
  }
  
  // Add education
  if (resume.education) {
    resume.education.forEach(edu => {
      parts.push(edu.institution || '');
      parts.push(edu.degree || '');
      parts.push(edu.fieldOfStudy || '');
      parts.push(edu.description || '');
    });
  }
  
  // Add skills
  if (resume.skills) {
    parts.push(resume.skills.join(' '));
  }
  
  return parts.join(' ');
}

// Generate suggestions for improving resume based on job description
export function generateResumeSuggestions(resume: Partial<Resume>, keywords: string[]): string[] {
  const { missingKeywords, presentKeywords, score } = analyzeResumeAgainstKeywords(resume, keywords);
  
  const suggestions: string[] = [];
  
  // Check if basic info is complete
  if (resume.basicInfo) {
    const { name, title, email, phone, location } = resume.basicInfo;
    if (!name || !title || !email || !phone || !location) {
      suggestions.push('Complete your basic information section for better ATS recognition.');
    }
  } else {
    suggestions.push('Add your basic information to improve your resume.');
  }
  
  // Check for summary
  if (!resume.summary) {
    suggestions.push('Add a professional summary that includes relevant keywords from the job description.');
  }
  
  // Check for experiences
  if (!resume.experiences || resume.experiences.length === 0) {
    suggestions.push('Add work experiences with measurable achievements.');
  } else {
    // Check for quantifiable achievements in experience descriptions
    const hasQuantifiableAchievements = resume.experiences.some(exp => {
      const description = exp.description || '';
      return /\d+%|\d+ percent|increased|decreased|improved|reduced|generated|saved|managed|led|launched/i.test(description);
    });
    
    if (!hasQuantifiableAchievements) {
      suggestions.push('Include quantifiable achievements in your experience descriptions (e.g., "Increased sales by 25%").');
    }
  }
  
  // Check for missing keywords
  if (missingKeywords.length > 0) {
    suggestions.push(`Include these missing keywords in your resume: ${missingKeywords.slice(0, 5).join(', ')}${missingKeywords.length > 5 ? '...' : ''}`);
  }
  
  // Check for skills section
  if (!resume.skills || resume.skills.length === 0) {
    suggestions.push('Add a skills section with relevant technical skills from the job description.');
  }
  
  // Check for education
  if (!resume.education || resume.education.length === 0) {
    suggestions.push('Add your educational background to complete your resume.');
  }
  
  // Add general ATS tips if few specific suggestions
  if (suggestions.length < 3) {
    suggestions.push('Use standard section headings (e.g., "Experience" not "Where I\'ve Worked").');
    suggestions.push('Keep formatting simple - avoid tables, headers/footers, and images.');
  }
  
  return suggestions;
}

// Generate simulated experience based on job description
export function generateSimulatedExperience(jobTitle: string, keywords: string[]): Experience {
  // Select a random company name from a list of generic company names
  const companyNames = [
    'TechSolutions Inc.',
    'Innovate Systems',
    'Global Technologies',
    'NextGen Solutions',
    'Digital Dynamics',
    'Future Innovations',
    'Strategic Solutions',
    'Precision Technologies',
    'Enterprise Systems',
    'Modern Applications'
  ];
  
  const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
  
  // Generate dates (1-3 years in the past)
  const endDate = new Date();
  const duration = Math.floor(Math.random() * 24) + 12; // 12-36 months
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - duration);
  
  // Format dates as YYYY-MM
  const formattedStartDate = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
  const formattedEndDate = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}`;
  
  // Select relevant keywords for this experience (up to 5)
  const selectedKeywords = keywords.slice(0, Math.min(5, keywords.length));
  
  // Generate a description using the selected keywords
  const description = generateDescriptionWithKeywords(jobTitle, selectedKeywords);
  
  return {
    id: `simulated-${Date.now()}`,
    companyName,
    jobTitle,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    description,
    keySkills: selectedKeywords,
    isSimulated: true
  };
}

// Helper to generate a realistic-sounding description with keywords
function generateDescriptionWithKeywords(jobTitle: string, keywords: string[]): string {
  const achievements = [
    'Increased team productivity by 20% through implementation of improved workflows',
    'Reduced system downtime by 30% by implementing proactive monitoring solutions',
    'Developed and maintained documentation that improved onboarding efficiency by 25%',
    'Collaborated with cross-functional teams to deliver projects on time and within budget',
    'Recognized for exceptional problem-solving skills and attention to detail',
    'Spearheaded initiatives that resulted in significant cost savings',
    'Mentored junior team members, improving overall team performance',
    'Identified and resolved critical issues before they impacted business operations'
  ];
  
  const selectedAchievements = achievements.slice(0, 3);
  
  // Create bullet points incorporating keywords
  const bulletPoints: string[] = [];
  
  // Add keyword-based bullet points
  keywords.forEach((keyword, index) => {
    if (index < 3) {
      bulletPoints.push(`Utilized ${keyword} to improve project outcomes and efficiency`);
    }
  });
  
  // Add remaining keywords in a skills-focused bullet point if any left
  if (keywords.length > 3) {
    bulletPoints.push(`Applied expertise in ${keywords.slice(3).join(', ')} to solve complex business challenges`);
  }
  
  // Add some generic achievement bullet points
  selectedAchievements.forEach(achievement => {
    bulletPoints.push(achievement);
  });
  
  // Shuffle the bullet points for more natural appearance
  shuffleArray(bulletPoints);
  
  return bulletPoints.slice(0, 5).join('\n\n');
}

// Helper function to shuffle an array
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
