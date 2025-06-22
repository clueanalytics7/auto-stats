import { Link } from 'react-router-dom';
import exampleChart1 from '../assets/example-chart1.png';
import exampleChart2 from '../assets/example-chart2.png';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to EdgeChart</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Powerful data visualisation and analysis tool for your CSV files
        </p>
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Key Features</h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Interactive data visualisation with multiple chart types</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>No data leaves your browser - complete privacy</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Easy CSV upload and quick analysis</span>
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Export charts and results with one click</span>
            </li>
          </ul>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <img src={exampleChart1} alt="Example chart" className="rounded-lg" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-4 rounded-lg shadow">
          <img src={exampleChart2} alt="Example chart" className="rounded-lg" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              1. Upload your CSV file using our simple drag-and-drop interface
            </p>
            <p>
              2. Select the visualisation types you want to create
            </p>
            <p>
              3. Customise your charts with our intuitive controls
            </p>
            <p>
              4. Export or save your results
            </p>
          </div>
          <div className="mt-6">
            <Link
              to="/guide"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View detailed guide →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
