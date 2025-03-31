import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

interface Template {
  id: string;
  name: string;
  thumbnail: React.ReactNode;
}

export default function TemplateSelector({
  selectedTemplate,
  onTemplateChange,
}: TemplateSelectorProps) {
  const templates: Template[] = [
    {
      id: "professional",
      name: "Professional",
      thumbnail: (
        <div className="h-16 w-full bg-white mb-2 flex flex-col p-1">
          <div className="h-2 w-3/4 bg-primary mb-1 rounded-sm"></div>
          <div className="h-1 w-1/2 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="h-1 w-full bg-gray-200 rounded-sm"></div>
        </div>
      ),
    },
    {
      id: "modern",
      name: "Modern",
      thumbnail: (
        <div className="h-16 w-full bg-white mb-2 flex flex-col p-1">
          <div className="h-2 w-3/4 bg-gray-300 mb-1 rounded-sm"></div>
          <div className="h-1 w-1/2 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="h-1 w-full bg-gray-200 rounded-sm"></div>
        </div>
      ),
    },
    {
      id: "simple",
      name: "Simple",
      thumbnail: (
        <div className="h-16 w-full bg-white mb-2 flex flex-col p-1">
          <div className="h-2 w-3/4 bg-gray-300 mb-1 rounded-sm"></div>
          <div className="h-1 w-1/2 bg-gray-200 mb-1 rounded-sm"></div>
          <div className="h-1 w-full bg-gray-200 rounded-sm"></div>
        </div>
      ),
    },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Resume Template</label>
      <div className="grid grid-cols-3 gap-3">
        {templates.map((template) => (
          <div
            key={template.id}
            className={cn(
              "border rounded-md p-2 flex flex-col items-center justify-center cursor-pointer",
              template.id === selectedTemplate
                ? "border-2 border-primary bg-blue-50"
                : "border-gray-200 hover:border-accent"
            )}
            onClick={() => onTemplateChange(template.id)}
          >
            {template.thumbnail}
            <span
              className={cn(
                "text-xs",
                template.id === selectedTemplate
                  ? "font-medium text-primary"
                  : "text-gray-600"
              )}
            >
              {template.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
