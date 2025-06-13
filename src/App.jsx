import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { FiCheckCircle, FiAlertTriangle, FiUpload } from "react-icons/fi";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import DataTable from "./components/DataTable";
import ChartBuilder from "./components/ChartBuilder";
import CookieConsent from "./components/CookieConsent";
import SupportBanner from "./components/SupportBanner";
import ExportData from "./components/ExportData";
import Footer from './components/Footer';
import Home from "./pages/Home"; // Make sure to import Home
import Guide from "./pages/Guide";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Agent from "./pages/Agent";
import Privacy from './pages/Privacy';
import { initGA, logPageView } from "./lib/analytics";

function DataAnalysisPage({ tableData, isLoading, error, handleDataLoaded }) {
  return (
    <div className="space-y-4">
      {/* Compact File Upload */}
      <div className="bg-white p-3 rounded-lg shadow">
        <FileUpload onDataLoaded={handleDataLoaded} compact />
      </div>
      
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-3">
          <div className="flex items-center">
            <FiAlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        </div>
      )}

      {!isLoading && tableData.length > 0 && (
        <>
          <div className="bg-white p-3 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <FiCheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <h2 className="text-lg font-semibold">Data Preview (First 5 Rows)</h2>
              </div>
              <ExportData data={tableData} />
            </div>
            <DataTable data={tableData.slice(0, 5)} />
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow">
            <ChartBuilder data={tableData} />
          </div>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initGA('G-XXXXXXXXXX');
    logPageView();
  }, []);

  const handleDataLoaded = (data) => {
    setIsLoading(true);
    setError(null);
    
    try {
      setTimeout(() => {
        if (data.length === 0) {
          setError("The file appears to be empty");
        } else if (Object.keys(data[0]).length < 2) {
          setError("The file needs at least 2 columns for analysis");
        } else {
          setTableData(data);
        }
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to process the file");
      setIsLoading(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <CookieConsent />
        <div className="max-w-7xl mx-auto p-4 flex-grow w-full">
          <SupportBanner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={
              <>
                <h1 className="text-2xl font-bold text-gray-800 mb-3">AutoStats Dashboard</h1>
                <DataAnalysisPage 
                  tableData={tableData}
                  isLoading={isLoading}
                  error={error}
                  handleDataLoaded={handleDataLoaded}
                />
              </>
            } />
            <Route path="/guide" element={<Guide />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/agent" element={<Agent />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
