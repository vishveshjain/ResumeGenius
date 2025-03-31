import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { KeywordChip } from "@/components/ui/keyword-chip";
import { Loader2 } from "lucide-react";

interface JobDescriptionAnalyzerProps {
  onAnalysis: (keywords: string[]) => void;
}

export default function JobDescriptionAnalyzer({ onAnalysis }: JobDescriptionAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);

  const analyzeJobDescription = async () => {
    if (!jobDescription.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-job-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: jobDescription }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze job description");
      }

      const data = await response.json();
      setKeywords(data.keywords);
      onAnalysis(data.keywords);
    } catch (error) {
      console.error("Error analyzing job description:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mb-6 p-4 border border-dashed border-gray-300 rounded-md">
      <h3 className="font-medium mb-2 flex items-center text-primary">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        Job Description Analysis
      </h3>
      <p className="text-sm text-gray-600 mb-3">
        Paste the job description to analyze required skills and optimize your resume
      </p>
      <Textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 h-32 focus:ring-primary focus:border-primary"
        placeholder="Paste job description here..."
      />
      <Button
        onClick={analyzeJobDescription}
        disabled={isAnalyzing || !jobDescription.trim()}
        className="mt-3 bg-accent text-white hover:bg-accent/90"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
          </>
        ) : (
          "Analyze Requirements"
        )}
      </Button>

      {keywords.length > 0 && (
        <div className="mt-3">
          <p className="text-sm font-medium mb-2">Detected Keywords:</p>
          <div className="flex flex-wrap">
            {keywords.map((keyword) => (
              <KeywordChip key={keyword} keyword={keyword} highlighted />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
