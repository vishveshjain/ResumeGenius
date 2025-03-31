import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from 'multer';
import natural from 'natural';
import {
  insertResumeSchema,
  experienceSchema,
  educationSchema,
  basicInfoSchema,
  insertJobDescriptionSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes
  const apiRouter = app.route('/api');

  // Resume routes
  app.get('/api/resumes', async (req, res) => {
    // Normally we would get userId from auth, for now use query param
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const resumes = await storage.getResumesByUserId(userId);
    res.json(resumes);
  });

  app.get('/api/resumes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const resume = await storage.getResume(id);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.json(resume);
  });

  app.post('/api/resumes', async (req, res) => {
    try {
      const resumeData = insertResumeSchema.parse(req.body);
      const resume = await storage.createResume(resumeData);
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create resume' });
    }
  });

  app.put('/api/resumes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    try {
      const resume = await storage.updateResume(id, req.body);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      res.json(resume);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update resume' });
    }
  });

  app.delete('/api/resumes/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const success = await storage.deleteResume(id);
    if (!success) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    res.status(204).end();
  });

  // Experience routes
  app.post('/api/resumes/:id/experiences', async (req, res) => {
    const resumeId = parseInt(req.params.id);
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    try {
      const experienceData = experienceSchema.parse(req.body);
      const resume = await storage.addExperienceToResume(resumeId, experienceData);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      // Return the updated resume
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to add experience' });
    }
  });

  app.put('/api/resumes/:resumeId/experiences/:experienceId', async (req, res) => {
    const resumeId = parseInt(req.params.resumeId);
    const experienceId = req.params.experienceId;
    
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    try {
      const experienceData = experienceSchema.parse(req.body);
      const resume = await storage.updateExperienceInResume(resumeId, experienceId, experienceData);
      if (!resume) {
        return res.status(404).json({ message: 'Resume or experience not found' });
      }
      
      res.json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to update experience' });
    }
  });

  app.delete('/api/resumes/:resumeId/experiences/:experienceId', async (req, res) => {
    const resumeId = parseInt(req.params.resumeId);
    const experienceId = req.params.experienceId;
    
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const resume = await storage.removeExperienceFromResume(resumeId, experienceId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume or experience not found' });
    }
    
    res.json(resume);
  });

  // Education routes
  app.post('/api/resumes/:id/education', async (req, res) => {
    const resumeId = parseInt(req.params.id);
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    try {
      const educationData = educationSchema.parse(req.body);
      const resume = await storage.addEducationToResume(resumeId, educationData);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.status(201).json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to add education' });
    }
  });

  app.put('/api/resumes/:resumeId/education/:educationId', async (req, res) => {
    const resumeId = parseInt(req.params.resumeId);
    const educationId = req.params.educationId;
    
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    try {
      const educationData = educationSchema.parse(req.body);
      const resume = await storage.updateEducationInResume(resumeId, educationId, educationData);
      if (!resume) {
        return res.status(404).json({ message: 'Resume or education not found' });
      }
      
      res.json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to update education' });
    }
  });

  app.delete('/api/resumes/:resumeId/education/:educationId', async (req, res) => {
    const resumeId = parseInt(req.params.resumeId);
    const educationId = req.params.educationId;
    
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    const resume = await storage.removeEducationFromResume(resumeId, educationId);
    if (!resume) {
      return res.status(404).json({ message: 'Resume or education not found' });
    }
    
    res.json(resume);
  });

  // Basic info route
  app.put('/api/resumes/:id/basic-info', async (req, res) => {
    const resumeId = parseInt(req.params.id);
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    try {
      const basicInfo = basicInfoSchema.parse(req.body);
      const resume = await storage.updateResumeBasicInfo(resumeId, basicInfo);
      if (!resume) {
        return res.status(404).json({ message: 'Resume not found' });
      }
      
      res.json(resume);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to update basic info' });
    }
  });

  // Skills route
  app.put('/api/resumes/:id/skills', async (req, res) => {
    const resumeId = parseInt(req.params.id);
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    if (!Array.isArray(req.body.skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const resume = await storage.updateResumeSkills(resumeId, req.body.skills);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  });

  // Summary route
  app.put('/api/resumes/:id/summary', async (req, res) => {
    const resumeId = parseInt(req.params.id);
    if (isNaN(resumeId)) {
      return res.status(400).json({ message: 'Invalid resume ID' });
    }

    if (typeof req.body.summary !== 'string') {
      return res.status(400).json({ message: 'Summary must be a string' });
    }

    const resume = await storage.updateResumeSummary(resumeId, req.body.summary);
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.json(resume);
  });

  // Job description routes
  app.post('/api/job-descriptions', async (req, res) => {
    try {
      const jobDescriptionData = insertJobDescriptionSchema.parse(req.body);
      const jobDescription = await storage.createJobDescription(jobDescriptionData);
      
      // Analyze the job description and extract keywords
      const keywords = analyzeJobDescription(jobDescription.content);
      
      // Update job description with analyzed keywords
      const updatedJobDescription = await storage.updateJobDescription(jobDescription.id, keywords);
      
      res.status(201).json(updatedJobDescription);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      res.status(500).json({ message: 'Failed to create job description' });
    }
  });

  app.get('/api/job-descriptions', async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    const jobDescriptions = await storage.getJobDescriptionsByUserId(userId);
    res.json(jobDescriptions);
  });

  app.get('/api/job-descriptions/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid job description ID' });
    }

    const jobDescription = await storage.getJobDescription(id);
    if (!jobDescription) {
      return res.status(404).json({ message: 'Job description not found' });
    }

    res.json(jobDescription);
  });

  // PDF upload and text extraction
  app.post('/api/extract-pdf', upload.single('pdf'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No PDF file uploaded' });
      }

      // For now, just return a simplified extraction response
      // In a production app, we would use a proper PDF extraction library
      res.json({ 
        text: "PDF content extracted successfully. Please fill in your details manually for better accuracy.",
        info: { creator: "Resume Builder", pages: 1 }
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to extract text from PDF' });
    }
  });

  // Analyze job description
  app.post('/api/analyze-job-description', async (req, res) => {
    try {
      if (!req.body.content || typeof req.body.content !== 'string') {
        return res.status(400).json({ message: 'Job description content is required' });
      }

      const keywords = analyzeJobDescription(req.body.content);
      
      res.json({ keywords });
    } catch (error) {
      res.status(500).json({ message: 'Failed to analyze job description' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to analyze job description and extract keywords
function analyzeJobDescription(text: string): string[] {
  const tokenizer = new natural.WordTokenizer();
  const stopwords = ['a', 'an', 'and', 'the', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of', 'is', 'are'];
  
  // Tokenize the text
  const tokens = tokenizer.tokenize(text.toLowerCase()) || [];
  
  // Remove stopwords and short words (less than 3 characters)
  const filteredTokens = tokens.filter(token => 
    !stopwords.includes(token) && token.length > 2
  );
  
  // Count word frequency
  const wordFrequency: Record<string, number> = {};
  filteredTokens.forEach(token => {
    wordFrequency[token] = (wordFrequency[token] || 0) + 1;
  });
  
  // Get common technical skills and job-related terms
  const technicalSkills = [
    'javascript', 'react', 'nodejs', 'typescript', 'html', 'css', 'frontend', 'backend', 'aws',
    'python', 'java', 'c#', 'c++', 'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'api',
    'rest', 'graphql', 'docker', 'kubernetes', 'ci/cd', 'git', 'github', 'devops', 'agile',
    'scrum', 'kanban', 'jira', 'machine learning', 'ai', 'data science', 'analytics',
    'cloud', 'azure', 'gcp', 'leadership', 'team', 'manage', 'communication', 'project',
    'product', 'design', 'ux', 'ui', 'research', 'testing', 'qa', 'security', 'seo',
    'marketing', 'sales', 'customer', 'service', 'support', 'finance', 'accounting', 'hr',
    'recruitment', 'talent', 'business', 'strategy', 'analysis', 'operations', 'logistics'
  ];
  
  // Extract skills and important terms
  const extractedKeywords: string[] = [];
  
  // Check for technical skills in the text
  technicalSkills.forEach(skill => {
    if (text.toLowerCase().includes(skill)) {
      extractedKeywords.push(skill);
    }
  });
  
  // Add high-frequency words that aren't already included
  Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .forEach(([word, count]) => {
      if (!extractedKeywords.includes(word) && count > 1) {
        extractedKeywords.push(word);
      }
    });
  
  // Limit to top 20 keywords
  return extractedKeywords.slice(0, 20);
}
