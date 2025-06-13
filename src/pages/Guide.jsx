export default function Guide() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Guide</h1>
      <div className="prose max-w-none">
        <h2>Getting Started</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Upload your data file (CSV, Excel, or JSON)</li>
          <li>Preview the data table to verify correctness</li>
          <li>Create visualizations using the chart builder</li>
          <li>Export your results as images or data files</li>
        </ol>
        
        <h2 className="mt-6">Statistical Analysis</h2>
        <p>Our tool automatically detects:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Numeric vs categorical data</li>
          <li>Missing values</li>
          <li>Basic distributions and outliers</li>
        </ul>
      </div>
    </div>
  );
}




