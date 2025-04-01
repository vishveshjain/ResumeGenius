import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, FileText } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { extractTextFromPdf } from "@/lib/pdf-utils";

interface ResumeUploadProps {
  onResumeProcessed: (resumeData: ResumeData) => void;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  experiences: Array<{
    company: string;
    title: string;
    startDate: string;
    endDate?: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
  summary?: string;
}

export default function ResumeUpload({ onResumeProcessed }: ResumeUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        setSelectedFile(file);
        setIsUploading(false);
      } else {
        toast({
          variant: "destructive",
          title: "Invalid File Format",
          description: "Please upload a PDF file.",
        });
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProcessResume = async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      // Extract text from the PDF
      const extractedText = await extractTextFromPdf(selectedFile);
      
      // In a real implementation, we would use NLP to extract structured data
      // For this demo, we'll simulate the extraction with a delay
      setTimeout(() => {
        // Simulated structured resume data
        const parsedResumeData: ResumeData = {
          name: "Alex Taylor",
          title: "Full Stack Developer",
          email: "alex.taylor@example.com",
          phone: "(555) 123-4567",
          location: "San Francisco, CA",
          experiences: [
            {
              company: "Tech Solutions Inc.",
              title: "Full Stack Developer",
              startDate: "2020-06",
              description: "Developed responsive web applications using React, Node.js, and MongoDB. Implemented authentication systems and RESTful APIs."
            },
            {
              company: "Innovative Apps LLC",
              title: "Front-end Developer",
              startDate: "2018-03",
              endDate: "2020-05",
              description: "Created responsive user interfaces using HTML, CSS, and JavaScript. Collaborated with designers to implement UI/UX improvements."
            }
          ],
          education: [
            {
              institution: "State University",
              degree: "Bachelor of Science",
              fieldOfStudy: "Computer Science",
              startDate: "2014-09",
              endDate: "2018-05"
            }
          ],
          skills: ["JavaScript", "React", "Node.js", "MongoDB", "HTML/CSS", "Git", "Responsive Design"],
          summary: "Full Stack Developer with 5+ years of experience building web applications with JavaScript, React, and Node.js. Passionate about creating clean, efficient code and intuitive user experiences."
        };
        
        // Pass the parsed data to the parent component
        onResumeProcessed(parsedResumeData);
        
        toast({
          title: "Resume Processed",
          description: "Your resume has been successfully analyzed.",
        });
        
        setIsProcessing(false);
      }, 2000);
    } catch (error) {
      console.error("Resume processing error:", error);
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: "There was an error processing your resume. Please try again.",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf"
      />
      
      {!selectedFile ? (
        <Button 
          onClick={handleUploadClick} 
          className="w-full flex items-center justify-center bg-secondary text-secondary-foreground hover:bg-secondary/90"
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Uploading...
            </div>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2" />
              Upload Resume (PDF)
            </>
          )}
        </Button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center p-3 border border-gray-200 rounded-md bg-gray-50">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm font-medium truncate flex-1">{selectedFile.name}</span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedFile(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Change
            </Button>
          </div>
          
          <Button 
            onClick={handleProcessResume} 
            className="w-full bg-primary text-white hover:bg-primary/90"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Resume...
              </div>
            ) : (
              "Process Resume"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}