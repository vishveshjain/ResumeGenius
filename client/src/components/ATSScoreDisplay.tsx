import { cn } from "@/lib/utils";

interface ATSScoreDisplayProps {
  score: number;
  className?: string;
}

export default function ATSScoreDisplay({ score, className }: ATSScoreDisplayProps) {
  // Ensure score is between 0 and 100
  const safeScore = Math.min(100, Math.max(0, score));
  // Calculate the percentage for the conic gradient
  const percentage = safeScore;
  
  // Determine color based on score
  const getColor = () => {
    if (safeScore >= 80) return "text-success";
    if (safeScore >= 60) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className={cn("flex items-center", className)}>
      <div 
        className="relative w-[120px] h-[120px] rounded-full flex items-center justify-center"
        style={{
          background: `conic-gradient(#2557a7 0% ${percentage}%, #e5e7eb ${percentage}% 100%)`
        }}
      >
        <div className="w-[100px] h-[100px] bg-white rounded-full flex items-center justify-center">
          <span className={cn("text-2xl font-bold", getColor())}>
            {safeScore}%
          </span>
        </div>
      </div>
    </div>
  );
}
