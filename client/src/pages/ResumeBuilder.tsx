import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import StepProgress from "@/components/StepProgress";
import ExperienceForm from "@/components/ExperienceForm";
import ResumePreview from "@/components/ResumePreview";
import ATSScoreDisplay from "@/components/ATSScoreDisplay";
import TemplateSelector from "@/components/TemplateSelector";
import JobDescriptionAnalyzer from "@/components/JobDescriptionAnalyzer";
import ATSOptimizationTips from "@/components/ATSOptimizationTips";
import { useResumeData } from "@/hooks/use-resume-data";
import { Experience } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateSimulatedExperience } from "@/lib/resume-analyzer";
import { useToast } from "@/hooks/use-toast";

export default function ResumeBuilder() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const resumeId = id ? parseInt(id) : undefined;
  
  const resumeData = useResumeData({ resumeId });
  const [experienceMode, setExperienceMode] = useState<"authentic" | "simulated">("authentic");
  const [jobDescriptionKeywords, setJobDescriptionKeywords] = useState<string[]>([]);
  const [newResumeDialogOpen, setNewResumeDialogOpen] = useState(!resumeId);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  
  // Create a new resume when title is submitted
  const handleCreateNewResume = async () => {
    if (!newResumeTitle.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a title for your resume",
      });
      return;
    }
    
    const newResume = await resumeData.createResume(newResumeTitle);
    if (newResume) {
      setNewResumeDialogOpen(false);
      setLocation(`/resume-builder/${newResume.id}`);
    }
  };
  
  // Handle job description analysis
  const handleJobDescriptionAnalysis = (keywords: string[]) => {
    setJobDescriptionKeywords(keywords);
  };
  
  // Handle experience mode toggle
  const handleExperienceModeToggle = (mode: "authentic" | "simulated") => {
    setExperienceMode(mode);
  };
  
  // Handle adding experience
  const handleAddExperience = async (experience: Experience) => {
    await resumeData.addExperience(experience);
  };
  
  // Generate simulated experience
  const handleGenerateSimulatedExperience = () => {
    if (jobDescriptionKeywords.length === 0) {
      toast({
        variant: "destructive",
        title: "No Job Description",
        description: "Please analyze a job description first to generate simulated experience",
      });
      return;
    }
    
    // Get user input for job title
    const jobTitle = prompt("Enter the job title for simulated experience:");
    if (!jobTitle) return;
    
    const simulatedExperience = generateSimulatedExperience(jobTitle, jobDescriptionKeywords);
    resumeData.addExperience(simulatedExperience);
  };
  
  // Save progress
  const handleSaveProgress = async () => {
    const result = await resumeData.saveResumeData();
    if (result) {
      toast({
        title: "Resume Saved",
        description: "Your resume has been saved successfully",
      });
    }
  };
  
  // Steps for the progress bar
  const steps = ["Basic Info", "Experience", "Education", "Skills", "Finalize"];
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AppHeader onSaveProgress={handleSaveProgress} />
      
      <main className="flex-grow max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Progress tracker */}
        <StepProgress
          currentStep={resumeData.currentStep}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={(step) => resumeData.setCurrentStep(step)}
        />
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Form inputs */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-sm">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-semibold font-open-sans mb-1">Professional Experience</h2>
              <p className="text-gray-600 text-sm">
                Add your work experience or simulate relevant professional background
              </p>
            </div>
            
            {/* Mode toggle */}
            <div className="flex mb-6 bg-gray-100 p-4 rounded-md">
              <div className="w-1/2">
                <input
                  type="radio"
                  id="authentic"
                  name="experienceMode"
                  className="hidden"
                  checked={experienceMode === "authentic"}
                  onChange={() => handleExperienceModeToggle("authentic")}
                />
                <label
                  htmlFor="authentic"
                  className={`block text-center py-2 px-4 rounded-md cursor-pointer ${
                    experienceMode === "authentic"
                      ? "bg-white shadow font-medium text-primary"
                      : "hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  Authentic Experience
                </label>
              </div>
              <div className="w-1/2">
                <input
                  type="radio"
                  id="simulated"
                  name="experienceMode"
                  className="hidden"
                  checked={experienceMode === "simulated"}
                  onChange={() => handleExperienceModeToggle("simulated")}
                />
                <label
                  htmlFor="simulated"
                  className={`block text-center py-2 px-4 rounded-md cursor-pointer ${
                    experienceMode === "simulated"
                      ? "bg-white shadow font-medium text-primary"
                      : "hover:bg-gray-50 text-gray-500"
                  }`}
                >
                  Simulated Experience
                </label>
              </div>
            </div>
            
            {/* Job Description Analysis */}
            <JobDescriptionAnalyzer onAnalysis={handleJobDescriptionAnalysis} />
            
            {/* Experience Form */}
            {experienceMode === "authentic" ? (
              <ExperienceForm 
                onSave={handleAddExperience} 
                suggestedKeywords={jobDescriptionKeywords} 
              />
            ) : (
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Generate simulated professional experience based on the job description. 
                  This feature helps fresh graduates create a resume that matches job requirements.
                </p>
                <Button 
                  onClick={handleGenerateSimulatedExperience} 
                  className="bg-primary text-white hover:bg-primary/90 w-full"
                  disabled={jobDescriptionKeywords.length === 0}
                >
                  Generate Simulated Experience
                </Button>
                
                <div className="mt-4 bg-yellow-50 border border-yellow-100 p-4 rounded-md">
                  <h4 className="text-amber-800 font-medium mb-2">Important Note</h4>
                  <p className="text-sm text-amber-700">
                    Simulated experiences are meant to showcase potential skills and capabilities. 
                    Always be transparent during interviews about your actual experience level.
                  </p>
                </div>
              </div>
            )}
            
            {/* Display existing experiences */}
            {resumeData.experiences.length > 0 && (
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-4">Added Experiences</h3>
                <div className="space-y-4">
                  {resumeData.experiences.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{exp.jobTitle}</h4>
                          <p className="text-sm text-gray-600">
                            {exp.companyName} • {exp.startDate} - {exp.isCurrentJob ? "Present" : exp.endDate}
                            {exp.isSimulated && <span className="ml-2 text-accent">(Simulated)</span>}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              // ToDo: Edit experience functionality
                              toast({
                                title: "Coming Soon",
                                description: "Edit functionality will be available soon",
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => resumeData.removeExperience(exp.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* ATS Optimization Tips */}
            <ATSOptimizationTips />
          </div>
          
          {/* Right column: Preview */}
          <div className="w-full lg:w-1/2 bg-white p-6 rounded-lg shadow-sm">
            {/* ATS Score */}
            <div className="mb-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-800">ATS Compatibility Score</h3>
                <p className="text-sm text-gray-600">
                  How well your resume matches the job requirements
                </p>
              </div>
              <ATSScoreDisplay score={resumeData.atsScore} />
            </div>
            
            {/* Templates selector */}
            <TemplateSelector
              selectedTemplate={resumeData.templateId}
              onTemplateChange={(templateId) => resumeData.setTemplateId(templateId)}
            />
            
            {/* Resume Preview */}
            <ResumePreview
              basicInfo={resumeData.basicInfo}
              experiences={resumeData.experiences}
              education={resumeData.education}
              skills={resumeData.skills}
              summary={resumeData.summary}
              templateId={resumeData.templateId}
            />
          </div>
        </div>
      </main>
      
      <AppFooter />
      
      {/* New Resume Dialog */}
      <Dialog open={newResumeDialogOpen} onOpenChange={setNewResumeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a New Resume</DialogTitle>
            <DialogDescription>
              Give your resume a title to help you identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newResumeTitle}
              onChange={(e) => setNewResumeTitle(e.target.value)}
              placeholder="e.g. Software Developer Resume"
              className="w-full"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleCreateNewResume} className="bg-primary text-white hover:bg-primary/90">
              Create Resume
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
