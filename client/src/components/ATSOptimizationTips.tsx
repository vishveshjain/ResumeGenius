import { CheckCircle } from "lucide-react";

interface ATSOptimizationTipsProps {
  customTips?: string[];
}

export default function ATSOptimizationTips({ customTips }: ATSOptimizationTipsProps) {
  const defaultTips = [
    "Use concrete numbers and achievements (e.g., \"Increased sales by 25%\")",
    "Include keywords from the job description in your experience",
    "Keep formatting simple - avoid tables, headers/footers, and images",
    "Use standard section headings (e.g., \"Experience\" not \"Where I've Worked\")",
  ];

  const tipsToShow = customTips?.length ? customTips : defaultTips;

  return (
    <div className="mt-8 bg-blue-50 p-4 rounded-md">
      <h3 className="font-medium text-primary mb-2">ATS Optimization Tips</h3>
      <ul className="text-sm text-gray-700 space-y-2">
        {tipsToShow.map((tip, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="text-success h-4 w-4 mt-1 mr-2" />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
