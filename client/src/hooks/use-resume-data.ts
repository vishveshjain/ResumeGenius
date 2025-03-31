import { useState, useEffect } from 'react';
import { 
  BasicInfo, 
  Experience, 
  Education, 
  Resume,
} from '@shared/schema';
import { v4 as uuidv4 } from 'uuid';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UseResumeDataProps {
  resumeId?: number | null;
}

const DEFAULT_BASIC_INFO: BasicInfo = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: ''
};

export function useResumeData({ resumeId }: UseResumeDataProps = {}) {
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(DEFAULT_BASIC_INFO);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [summary, setSummary] = useState('');
  const [templateId, setTemplateId] = useState('professional');
  const [userId, setUserId] = useState<number>(1); // Default user id for demo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentResumeId, setCurrentResumeId] = useState<number | null>(resumeId || null);
  const [atsScore, setAtsScore] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  const { toast } = useToast();

  // Fetch resume data if resumeId is provided
  useEffect(() => {
    async function fetchResumeData() {
      if (!resumeId) return;
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/resumes/${resumeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch resume data');
        }
        
        const resume: Resume = await response.json();
        
        setBasicInfo(resume.basicInfo);
        setExperiences(resume.experiences || []);
        setEducation(resume.education || []);
        setSkills(resume.skills || []);
        setSummary(resume.summary || '');
        setTemplateId(resume.templateId || 'professional');
        setCurrentResumeId(resume.id);
      } catch (err) {
        setError((err as Error).message);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load resume data',
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchResumeData();
  }, [resumeId, toast]);

  // Create a new resume
  const createResume = async (title: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('POST', '/api/resumes', {
        title,
        userId,
        basicInfo,
        templateId,
      });
      
      const newResume: Resume = await response.json();
      setCurrentResumeId(newResume.id);
      
      toast({
        title: 'Success',
        description: 'Resume created successfully',
      });
      
      return newResume;
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create resume',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Save all resume data
  const saveResumeData = async () => {
    if (!currentResumeId) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No resume to save',
      });
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('PUT', `/api/resumes/${currentResumeId}`, {
        basicInfo,
        experiences,
        education,
        skills,
        summary,
        templateId,
      });
      
      const updatedResume: Resume = await response.json();
      
      toast({
        title: 'Success',
        description: 'Resume saved successfully',
      });
      
      return updatedResume;
    } catch (err) {
      setError((err as Error).message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to save resume',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Add experience
  const addExperience = async (experience: Omit<Experience, 'id'>) => {
    if (!currentResumeId) {
      // Add locally if no resume ID yet
      const newExperience = { ...experience, id: uuidv4() };
      setExperiences([...experiences, newExperience]);
      return newExperience;
    }
    
    try {
      const response = await apiRequest('POST', `/api/resumes/${currentResumeId}/experiences`, experience);
      const updatedResume: Resume = await response.json();
      setExperiences(updatedResume.experiences || []);
      
      toast({
        title: 'Success',
        description: 'Experience added successfully',
      });
      
      // Calculate a new ATS score when adding experience
      calculateAtsScore();
      
      return updatedResume;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to add experience',
      });
      return null;
    }
  };

  // Update experience
  const updateExperience = async (id: string, experience: Omit<Experience, 'id'>) => {
    if (!currentResumeId) {
      // Update locally if no resume ID yet
      const updatedExperiences = experiences.map((exp) => 
        exp.id === id ? { ...experience, id } : exp
      );
      setExperiences(updatedExperiences);
      return { ...experience, id };
    }
    
    try {
      const response = await apiRequest(
        'PUT', 
        `/api/resumes/${currentResumeId}/experiences/${id}`, 
        { ...experience, id }
      );
      const updatedResume: Resume = await response.json();
      setExperiences(updatedResume.experiences || []);
      
      toast({
        title: 'Success',
        description: 'Experience updated successfully',
      });
      
      // Recalculate ATS score
      calculateAtsScore();
      
      return updatedResume;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update experience',
      });
      return null;
    }
  };

  // Remove experience
  const removeExperience = async (id: string) => {
    if (!currentResumeId) {
      // Remove locally if no resume ID yet
      const filteredExperiences = experiences.filter((exp) => exp.id !== id);
      setExperiences(filteredExperiences);
      return true;
    }
    
    try {
      const response = await apiRequest(
        'DELETE', 
        `/api/resumes/${currentResumeId}/experiences/${id}`
      );
      const updatedResume: Resume = await response.json();
      setExperiences(updatedResume.experiences || []);
      
      toast({
        title: 'Success',
        description: 'Experience removed successfully',
      });
      
      // Recalculate ATS score
      calculateAtsScore();
      
      return true;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove experience',
      });
      return false;
    }
  };

  // Update basic info
  const updateBasicInfo = async (info: BasicInfo) => {
    setBasicInfo(info);
    
    if (!currentResumeId) return info;
    
    try {
      const response = await apiRequest('PUT', `/api/resumes/${currentResumeId}/basic-info`, info);
      const updatedResume: Resume = await response.json();
      
      toast({
        title: 'Success',
        description: 'Basic info updated successfully',
      });
      
      return updatedResume.basicInfo;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update basic info',
      });
      return info;
    }
  };

  // Analyze job description
  const analyzeJobDescription = async (content: string) => {
    try {
      const response = await apiRequest('POST', '/api/analyze-job-description', { content });
      const data = await response.json();
      
      // Calculate ATS score based on keywords
      calculateAtsScore(data.keywords);
      
      return data.keywords;
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to analyze job description',
      });
      return [];
    }
  };

  // Calculate ATS score
  const calculateAtsScore = (keywords?: string[]) => {
    if (!experiences.length) {
      setAtsScore(0);
      return;
    }
    
    // Base score starts at 50
    let score = 50;
    
    // Add points for having basic info complete
    const basicInfoFields = Object.values(basicInfo).filter(Boolean);
    score += Math.min(10, basicInfoFields.length * 2);
    
    // Add points for experiences (up to 20 points)
    score += Math.min(20, experiences.length * 5);
    
    // If we have keywords from job description, check for matches
    if (keywords && keywords.length) {
      const allSkills = [
        ...skills,
        ...experiences.flatMap(exp => exp.keySkills || [])
      ];
      
      // Count how many keywords match skills
      const matchCount = keywords.filter(keyword => 
        allSkills.some(skill => 
          skill.toLowerCase().includes(keyword.toLowerCase())
        )
      ).length;
      
      // Add up to 20 points based on keyword matches
      score += Math.min(20, (matchCount / keywords.length) * 20);
    } else {
      // Add some points for having skills listed
      score += Math.min(10, skills.length);
    }
    
    setAtsScore(Math.min(100, score));
  };

  return {
    basicInfo,
    experiences,
    education,
    skills,
    summary,
    templateId,
    userId,
    loading,
    error,
    currentResumeId,
    atsScore,
    currentStep,
    setBasicInfo,
    setExperiences,
    setEducation,
    setSkills,
    setSummary,
    setTemplateId,
    setUserId,
    setCurrentStep,
    createResume,
    saveResumeData,
    addExperience,
    updateExperience,
    removeExperience,
    updateBasicInfo,
    analyzeJobDescription,
  };
}
