import { Link } from 'react-router-dom';
import { FiHome, FiBarChart2, FiMessageSquare } from 'react-icons/fi';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
            >
              <FiHome className="mr-1" /> Home
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <FiBarChart2 className="mr-1" /> EdgeDashboard
            </Link>
            <Link
              to="/agent"
              className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-gray-300 text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              <FiMessageSquare className="mr-1" /> EdgeAgent
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

