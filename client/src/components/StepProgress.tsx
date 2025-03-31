import { cn } from "@/lib/utils";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

export default function StepProgress({
  currentStep,
  totalSteps,
  steps,
  onStepClick,
}: StepProgressProps) {
  const percentComplete = (currentStep / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Progress</span>
        <span className="text-sm font-medium">
          {currentStep} of {totalSteps} steps completed
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        {steps.map((step, index) => (
          <button
            key={index}
            onClick={() => onStepClick && onStepClick(index + 1)}
            className={cn(
              "focus:outline-none",
              index + 1 <= currentStep ? "text-primary font-medium" : ""
            )}
          >
            {step}
          </button>
        ))}
      </div>
    </div>
  );
}
