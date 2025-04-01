import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Linkedin } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LinkedInLoginProps {
  onProfileReceived: (profileData: LinkedInProfileData) => void;
}

export interface LinkedInProfileData {
  firstName: string;
  lastName: string;
  headline: string;
  profileUrl: string;
  email: string;
  positions: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  educations: Array<{
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

export default function LinkedInLogin({ onProfileReceived }: LinkedInLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLinkedInLogin = async () => {
    setIsLoading(true);
    
    try {
      // Since we're doing a client-side simulation, we'll create a simulated LinkedIn profile
      // In a real application, this would be an OAuth flow with LinkedIn's API
      setTimeout(() => {
        const mockLinkedInProfile: LinkedInProfileData = {
          firstName: "Jane",
          lastName: "Doe",
          headline: "Senior Software Engineer at Technology Inc.",
          profileUrl: "https://linkedin.com/in/janedoe",
          email: "jane.doe@example.com",
          positions: [
            {
              title: "Senior Software Engineer",
              company: "Technology Inc.",
              startDate: "2020-01",
              description: "Leading development of cloud-based applications using React, Node.js, and AWS. Implemented CI/CD pipelines and improved system performance by 30%."
            },
            {
              title: "Software Developer",
              company: "Digital Solutions LLC",
              startDate: "2017-03",
              endDate: "2019-12",
              description: "Developed and maintained web applications using JavaScript, HTML, and CSS. Collaborated with cross-functional teams to deliver projects on time."
            }
          ],
          educations: [
            {
              school: "University of Technology",
              degree: "Bachelor of Science",
              fieldOfStudy: "Computer Science",
              startDate: "2013-09",
              endDate: "2017-05"
            }
          ],
          skills: ["JavaScript", "React", "Node.js", "AWS", "TypeScript", "Git", "CI/CD", "Agile"]
        };
        
        onProfileReceived(mockLinkedInProfile);
        
        toast({
          title: "LinkedIn Profile Imported",
          description: "Your LinkedIn data has been imported successfully.",
        });
        
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error("LinkedIn login error:", error);
      toast({
        variant: "destructive",
        title: "LinkedIn Login Failed",
        description: "There was an error connecting to LinkedIn. Please try again.",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleLinkedInLogin} 
      className="bg-[#0077B5] hover:bg-[#0077B5]/90 text-white w-full flex items-center justify-center" 
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Connecting to LinkedIn...
        </div>
      ) : (
        <>
          <Linkedin className="h-5 w-5 mr-2" />
          Import from LinkedIn
        </>
      )}
    </Button>
  );
}