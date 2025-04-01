import React, { useState } from 'react';
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LinkedInLogin, { LinkedInProfileData } from './LinkedInLogin';
import ResumeUpload, { ResumeData as UploadedResumeData } from './ResumeUpload';
import { useToast } from "@/hooks/use-toast";
import { useResumeData } from "@/hooks/use-resume-data";
import { Experience, Education, BasicInfo } from "@shared/schema";
import { v4 as uuidv4 } from 'uuid';

interface ImportResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportResumeModal({ isOpen, onClose }: ImportResumeModalProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const resumeData = useResumeData();
  const [isCreating, setIsCreating] = useState(false);

  const handleLinkedInProfileReceived = async (profile: LinkedInProfileData) => {
    try {
      setIsCreating(true);
      
      // Create a new resume
      const newResumeTitle = `${profile.firstName} ${profile.lastName}'s Resume`;
      
      // Convert LinkedIn profile data to resume format
      const basicInfo: BasicInfo = {
        name: `${profile.firstName} ${profile.lastName}`,
        title: profile.headline,
        email: profile.email,
        phone: "", // LinkedIn doesn't provide phone directly
        location: "", // LinkedIn doesn't provide location directly
        linkedin: profile.profileUrl
      };
      
      // Convert positions to experiences
      const experiences: Experience[] = profile.positions.map(position => ({
        id: uuidv4(),
        companyName: position.company,
        jobTitle: position.title,
        startDate: position.startDate,
        endDate: position.endDate,
        isCurrentJob: !position.endDate,
        description: position.description || "",
        keySkills: [],
        isSimulated: false
      }));
      
      // Convert educations
      const education: Education[] = profile.educations.map(edu => ({
        id: uuidv4(),
        institution: edu.school,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: ""
      }));
      
      const newResume = await resumeData.createResume(newResumeTitle);
      
      if (newResume) {
        // Update basic info
        await resumeData.updateBasicInfo(basicInfo);
        
        // Add experiences
        for (const exp of experiences) {
          await resumeData.addExperience(exp);
        }
        
        // Add education
        for (const edu of education) {
          await resumeData.addEducation(edu);
        }
        
        // Update skills
        await resumeData.updateSkills(profile.skills);
        
        // Redirect to the resume builder
        setLocation(`/resume-builder/${newResume.id}`);
        
        toast({
          title: "Resume Created",
          description: "Your LinkedIn data has been imported successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating resume from LinkedIn:", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "There was an error creating your resume. Please try again.",
      });
    } finally {
      setIsCreating(false);
      onClose();
    }
  };

  const handleResumeProcessed = async (uploadedData: UploadedResumeData) => {
    try {
      setIsCreating(true);
      
      // Create a new resume
      const newResumeTitle = `${uploadedData.name}'s Resume`;
      
      // Convert uploaded resume data to the app format
      const basicInfo: BasicInfo = {
        name: uploadedData.name,
        title: uploadedData.title,
        email: uploadedData.email,
        phone: uploadedData.phone,
        location: uploadedData.location,
      };
      
      // Convert experiences
      const experiences: Experience[] = uploadedData.experiences.map((exp: {
        company: string;
        title: string;
        startDate: string;
        endDate?: string;
        description: string;
      }) => ({
        id: uuidv4(),
        companyName: exp.company,
        jobTitle: exp.title,
        startDate: exp.startDate,
        endDate: exp.endDate,
        isCurrentJob: !exp.endDate,
        description: exp.description,
        keySkills: [],
        isSimulated: false
      }));
      
      // Convert educations
      const education: Education[] = uploadedData.education.map((edu: {
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        startDate: string;
        endDate: string;
      }) => ({
        id: uuidv4(),
        institution: edu.institution,
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        startDate: edu.startDate,
        endDate: edu.endDate,
        description: ""
      }));
      
      const newResume = await resumeData.createResume(newResumeTitle);
      
      if (newResume) {
        // Update basic info
        await resumeData.updateBasicInfo(basicInfo);
        
        // Add summary if available
        if (uploadedData.summary) {
          await resumeData.updateSummary(uploadedData.summary);
        }
        
        // Add experiences
        for (const exp of experiences) {
          await resumeData.addExperience(exp);
        }
        
        // Add education
        for (const edu of education) {
          await resumeData.addEducation(edu);
        }
        
        // Update skills
        await resumeData.updateSkills(uploadedData.skills);
        
        // Redirect to the resume builder
        setLocation(`/resume-builder/${newResume.id}`);
        
        toast({
          title: "Resume Created",
          description: "Your resume has been uploaded and processed successfully.",
        });
      }
    } catch (error) {
      console.error("Error creating resume from upload:", error);
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "There was an error processing your resume. Please try again.",
      });
    } finally {
      setIsCreating(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[485px]">
        <DialogHeader>
          <DialogTitle>Import Resume</DialogTitle>
          <DialogDescription>
            Create a resume by importing from LinkedIn or uploading an existing PDF.
          </DialogDescription>
        </DialogHeader>

        {isCreating ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
            <p className="text-center text-gray-600">Creating your resume...</p>
          </div>
        ) : (
          <Tabs defaultValue="linkedin" className="py-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
              <TabsTrigger value="upload">Upload Resume</TabsTrigger>
            </TabsList>
            
            <TabsContent value="linkedin" className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Import your professional experience, education and skills directly from LinkedIn.
              </p>
              <LinkedInLogin onProfileReceived={handleLinkedInProfileReceived} />
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-4">
              <p className="text-sm text-gray-600 mb-2">
                Upload your existing resume (PDF format) and we'll extract the information automatically.
              </p>
              <ResumeUpload onResumeProcessed={handleResumeProcessed} />
            </TabsContent>
          </Tabs>
        )}
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={isCreating}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}