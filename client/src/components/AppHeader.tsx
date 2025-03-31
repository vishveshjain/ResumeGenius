import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface AppHeaderProps {
  onSaveProgress?: () => void;
}

export default function AppHeader({ onSaveProgress }: AppHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary font-open-sans cursor-pointer">
              ATS Resume Builder
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <Button variant="ghost" className="text-gray-600 hover:text-primary">
            <i className="fas fa-question-circle mr-2"></i> Help
          </Button>
          {onSaveProgress && (
            <Button onClick={onSaveProgress} className="bg-primary text-white hover:bg-primary/90">
              Save progress
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
