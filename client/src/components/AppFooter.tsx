import { Link } from "wouter";

export default function AppFooter() {
  return (
    <footer className="bg-gray-100 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <h3 className="text-lg font-semibold text-primary mb-2 cursor-pointer">
                ATS Resume Builder
              </h3>
            </Link>
            <p className="text-gray-600 text-sm">
              Create professional, ATS-optimized resumes that get you noticed
            </p>
          </div>
          <div className="flex space-x-8">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Support</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link href="#">
                    <a className="hover:text-primary">Help Center</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="hover:text-primary">Contact Us</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="hover:text-primary">Privacy Policy</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Resources</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  <Link href="#">
                    <a className="hover:text-primary">Resume Tips</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="hover:text-primary">ATS Guide</a>
                  </Link>
                </li>
                <li>
                  <Link href="#">
                    <a className="hover:text-primary">Templates</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} ATS Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
