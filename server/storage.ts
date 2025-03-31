import {
  users, type User, type InsertUser,
  resumes, type Resume, type InsertResume,
  jobDescriptions, type JobDescription, type InsertJobDescription,
  Experience, BasicInfo, Education
} from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

// Storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Resume operations
  getResume(id: number): Promise<Resume | undefined>;
  getResumesByUserId(userId: number): Promise<Resume[]>;
  createResume(resume: InsertResume): Promise<Resume>;
  updateResume(id: number, resume: Partial<Resume>): Promise<Resume | undefined>;
  deleteResume(id: number): Promise<boolean>;
  
  // Job Description operations
  getJobDescription(id: number): Promise<JobDescription | undefined>;
  getJobDescriptionsByUserId(userId: number): Promise<JobDescription[]>;
  createJobDescription(jobDescription: InsertJobDescription): Promise<JobDescription>;
  updateJobDescription(id: number, keywords: string[]): Promise<JobDescription | undefined>;
  deleteJobDescription(id: number): Promise<boolean>;
  
  // Experience operations
  addExperienceToResume(resumeId: number, experience: Experience): Promise<Resume | undefined>;
  updateExperienceInResume(resumeId: number, experienceId: string, experience: Experience): Promise<Resume | undefined>;
  removeExperienceFromResume(resumeId: number, experienceId: string): Promise<Resume | undefined>;
  
  // Education operations
  addEducationToResume(resumeId: number, education: Education): Promise<Resume | undefined>;
  updateEducationInResume(resumeId: number, educationId: string, education: Education): Promise<Resume | undefined>;
  removeEducationFromResume(resumeId: number, educationId: string): Promise<Resume | undefined>;
  
  // Skills operations
  updateResumeSkills(resumeId: number, skills: string[]): Promise<Resume | undefined>;
  
  // Basic Info operations
  updateResumeBasicInfo(resumeId: number, basicInfo: BasicInfo): Promise<Resume | undefined>;
  
  // Summary operations
  updateResumeSummary(resumeId: number, summary: string): Promise<Resume | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private resumes: Map<number, Resume>;
  private jobDescriptions: Map<number, JobDescription>;
  private userId: number;
  private resumeId: number;
  private jobDescriptionId: number;

  constructor() {
    this.users = new Map();
    this.resumes = new Map();
    this.jobDescriptions = new Map();
    this.userId = 1;
    this.resumeId = 1;
    this.jobDescriptionId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Resume operations
  async getResume(id: number): Promise<Resume | undefined> {
    return this.resumes.get(id);
  }

  async getResumesByUserId(userId: number): Promise<Resume[]> {
    return Array.from(this.resumes.values()).filter(
      (resume) => resume.userId === userId,
    );
  }

  async createResume(insertResume: InsertResume): Promise<Resume> {
    const id = this.resumeId++;
    const now = new Date();
    const resume: Resume = {
      ...insertResume,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.resumes.set(id, resume);
    return resume;
  }

  async updateResume(id: number, resumeUpdate: Partial<Resume>): Promise<Resume | undefined> {
    const resume = this.resumes.get(id);
    if (!resume) return undefined;
    
    const updatedResume: Resume = {
      ...resume,
      ...resumeUpdate,
      updatedAt: new Date(),
    };
    
    this.resumes.set(id, updatedResume);
    return updatedResume;
  }

  async deleteResume(id: number): Promise<boolean> {
    return this.resumes.delete(id);
  }

  // Job Description operations
  async getJobDescription(id: number): Promise<JobDescription | undefined> {
    return this.jobDescriptions.get(id);
  }

  async getJobDescriptionsByUserId(userId: number): Promise<JobDescription[]> {
    return Array.from(this.jobDescriptions.values()).filter(
      (jobDescription) => jobDescription.userId === userId,
    );
  }

  async createJobDescription(insertJobDescription: InsertJobDescription): Promise<JobDescription> {
    const id = this.jobDescriptionId++;
    const jobDescription: JobDescription = {
      ...insertJobDescription,
      id,
      analyzedKeywords: [],
      createdAt: new Date(),
    };
    this.jobDescriptions.set(id, jobDescription);
    return jobDescription;
  }

  async updateJobDescription(id: number, keywords: string[]): Promise<JobDescription | undefined> {
    const jobDescription = this.jobDescriptions.get(id);
    if (!jobDescription) return undefined;
    
    const updatedJobDescription: JobDescription = {
      ...jobDescription,
      analyzedKeywords: keywords,
    };
    
    this.jobDescriptions.set(id, updatedJobDescription);
    return updatedJobDescription;
  }

  async deleteJobDescription(id: number): Promise<boolean> {
    return this.jobDescriptions.delete(id);
  }

  // Experience operations
  async addExperienceToResume(resumeId: number, experience: Experience): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const experienceWithId: Experience = {
      ...experience,
      id: experience.id || uuidv4(),
    };
    
    const updatedResume: Resume = {
      ...resume,
      experiences: [...(resume.experiences || []), experienceWithId],
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  async updateExperienceInResume(resumeId: number, experienceId: string, experience: Experience): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const updatedExperiences = (resume.experiences || []).map(exp => 
      exp.id === experienceId ? { ...experience, id: experienceId } : exp
    );
    
    const updatedResume: Resume = {
      ...resume,
      experiences: updatedExperiences,
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  async removeExperienceFromResume(resumeId: number, experienceId: string): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const updatedExperiences = (resume.experiences || []).filter(exp => exp.id !== experienceId);
    
    const updatedResume: Resume = {
      ...resume,
      experiences: updatedExperiences,
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  // Education operations
  async addEducationToResume(resumeId: number, education: Education): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const educationWithId: Education = {
      ...education,
      id: education.id || uuidv4(),
    };
    
    const updatedResume: Resume = {
      ...resume,
      education: [...(resume.education || []), educationWithId],
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  async updateEducationInResume(resumeId: number, educationId: string, education: Education): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const updatedEducation = (resume.education || []).map(edu => 
      edu.id === educationId ? { ...education, id: educationId } : edu
    );
    
    const updatedResume: Resume = {
      ...resume,
      education: updatedEducation,
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  async removeEducationFromResume(resumeId: number, educationId: string): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const updatedEducation = (resume.education || []).filter(edu => edu.id !== educationId);
    
    const updatedResume: Resume = {
      ...resume,
      education: updatedEducation,
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  // Skills operations
  async updateResumeSkills(resumeId: number, skills: string[]): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const updatedResume: Resume = {
      ...resume,
      skills,
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  // Basic Info operations
  async updateResumeBasicInfo(resumeId: number, basicInfo: BasicInfo): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const updatedResume: Resume = {
      ...resume,
      basicInfo,
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }

  // Summary operations
  async updateResumeSummary(resumeId: number, summary: string): Promise<Resume | undefined> {
    const resume = this.resumes.get(resumeId);
    if (!resume) return undefined;
    
    const updatedResume: Resume = {
      ...resume,
      summary,
      updatedAt: new Date(),
    };
    
    this.resumes.set(resumeId, updatedResume);
    return updatedResume;
  }
}

export const storage = new MemStorage();
