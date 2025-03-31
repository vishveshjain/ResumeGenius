import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

export default function Home() {
  const [location, setLocation] = useLocation();

  const handleCreateResume = () => {
    setLocation("/resume-builder");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
                  Create an <span className="text-primary">ATS-Friendly</span> Resume That Gets You Noticed
                </h1>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl">
                  Our intelligent resume builder analyzes job descriptions to optimize your resume for Applicant Tracking Systems and human recruiters.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button 
                    onClick={handleCreateResume}
                    className="px-8 py-3 bg-primary text-white hover:bg-primary/90 text-lg"
                  >
                    Build Your Resume
                  </Button>
                  <Button variant="outline" className="px-8 py-3 text-lg">
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="mt-12 lg:mt-0">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                  <div className="h-6 w-24 bg-primary rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                    <div className="h-4 w-4/6 bg-gray-100 rounded"></div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-full bg-gray-100 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                  </div>
                  <div className="mt-6">
                    <div className="h-10 w-full bg-accent rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Key Features</h2>
              <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                Our resume builder helps both fresh graduates and experienced professionals create optimized resumes.
              </p>
            </div>

            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 text-primary rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ATS Optimization</h3>
                <p className="text-gray-600">
                  Analyze job descriptions to extract keywords and optimize your resume to pass through Applicant Tracking Systems.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 text-primary rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Experience Simulation</h3>
                <p className="text-gray-600">
                  Fresh graduates can generate professional-looking experience entries based on their skills and target job.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="w-12 h-12 bg-blue-100 text-primary rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Templates</h3>
                <p className="text-gray-600">
                  Choose from professionally designed templates that are both visually appealing and ATS-friendly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Land Your Dream Job?</h2>
            <p className="mt-4 text-xl text-white/80 max-w-3xl mx-auto">
              Create your ATS-optimized resume today and increase your chances of getting an interview.
            </p>
            <Button
              onClick={handleCreateResume}
              className="mt-8 px-8 py-3 text-lg bg-white text-primary hover:bg-gray-100"
            >
              Build Your Resume Now
            </Button>
          </div>
        </section>
      </main>

      <AppFooter />
    </div>
  );
}
