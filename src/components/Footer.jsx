import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-8 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">EdgeChart</h3>
            <p className="text-gray-600 text-sm">
              Powerful data visualisation and analysis tool for your CSV files.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/guide" className="text-gray-600 hover:text-blue-600 text-sm">
                  User Guide
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://x.com/ClueAnalytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 text-sm flex items-center"
                >
                  <FaTwitter className="mr-2" /> Follow us on X
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/company/clueanalytics"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 text-sm flex items-center"
                >
                  <FaLinkedin className="mr-2" /> Connect on LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/people/Clue-Analytics/61577401499277/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 text-sm flex items-center"
                >
                  <FaFacebook className="mr-2" /> Like us on Facebook
                </a>
              </li>
            </ul>
          </div>
        </div> 
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} <a href="https://clue-analytics.web.app/" target="_blank" rel="noopener noreferrer" class="text-gray-200 hover:text-blue-400 transition-colors">ClueAnalytics</a> - EdgeChart. All rights reserved. 
        </div>
      </div>
    </footer>
  );
}
