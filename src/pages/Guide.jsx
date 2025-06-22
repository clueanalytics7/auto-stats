import { Link } from 'react-router-dom';

export default function Guide() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">EdgeChart User Guide</h1>
      <div className="prose max-w-none">
        <p className="text-lg text-gray-700">
          Welcome to EdgeChart! This guide will walk you through how to use our tool to visualise and analyse your data directly in your browser. No uploads, no servers—just fast, secure, and easy data exploration.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Getting Started</h2>
        <p className="text-gray-700">
          Follow these steps to transform your data into insightful visualisations:
        </p>
        <ol className="list-decimal pl-5 space-y-3 text-gray-700">
          <li>
            <strong>Upload Your Data:</strong> Go to the <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link> and upload your data file. EdgeChart supports CSV, Excel (.xlsx, .xls), and JSON formats. Ensure your file has clear column headers for best results.
          </li>
          <li>
            <strong>Preview Your Data:</strong> Once uploaded, EdgeChart displays the first five rows of your data in a table. Check for accuracy and ensure your data is formatted correctly (e.g., numbers in numeric columns, no mixed data types).
          </li>
          <li>
            <strong>Create Visualisations:</strong> Use the Chart Builder to select your data columns and choose from various chart types (e.g., bar, line, scatter). Customise labels, colors, and more to make your chart shine.
          </li>
          <li>
            <strong>Export Your Results:</strong> Save your charts as PNG or SVG images, or export your processed data as a CSV file for further use.
          </li>
        </ol>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Supported File Formats</h2>
        <p className="text-gray-700">
          EdgeChart works with the following file types:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li><strong>CSV:</strong> Comma-separated values with clear column headers (e.g., "Name,Age,Sales").</li>
          <li><strong>Excel:</strong> .xlsx or .xls files with structured data in sheets.</li>
          <li><strong>JSON:</strong> Array of objects with consistent keys (e.g., <code>[{'{'}"name": "Alice", "age": 30{'}'}, ...]</code>).</li>
        </ul>
        <p className="text-gray-700">
          <strong>Tip:</strong> For best results, ensure your file has at least two columns and no more than 10,000 rows to maintain smooth performance.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Statistical Analysis</h2>
        <p className="text-gray-700">
          EdgeChart automatically analyses your data to provide useful insights, including:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Numeric vs. Categorical Data:</strong> Identifies whether columns contain numbers (e.g., sales, temperature) or categories (e.g., regions, names) to suggest appropriate chart types.</li>
          <li><strong>Missing Values:</strong> Flags any empty or invalid entries and provides options to handle them (e.g., ignore or fill with defaults).</li>
          <li><strong>Basic Distributions and Outliers:</strong> Shows summaries like mean, median, and range for numeric data, and highlights potential outliers to help you spot anomalies.</li>
        </ul>
        <p className="text-gray-700">
          These insights appear in the Chart Builder, helping you make informed decisions about which visualisations to create.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Chart Customisation</h2>
        <p className="text-gray-700">
          EdgeChart’s Chart Builder lets you tailor your visualisations:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li>Choose from multiple chart types (bar, line, pie, scatter, etc.).</li>
          <li>Adjust colors, fonts, and labels to match your style.</li>
          <li>Add titles and legends for clarity.</li>
          <li>Zoom and pan on interactive charts for deeper exploration.</li>
        </ul>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Troubleshooting</h2>
        <p className="text-gray-700">
          Encountering issues? Here are common fixes:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-700">
          <li><strong>File Upload Errors:</strong> Ensure your file is in a supported format and under 10MB. Check for special characters in headers.</li>
          <li><strong>Slow Performance:</strong> Large datasets may require a modern browser and sufficient device memory. Try reducing rows or columns.</li>
          <li><strong>Chart Not Displaying:</strong> Verify that your data has at least one numeric column for charts like bar or line graphs.</li>
        </ul>
        <p className="text-gray-700">
          Need more help? Visit our <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link> page to reach out.
        </p>

        <h2 className="mt-6 text-2xl font-semibold text-gray-800">Ready to Explore?</h2>
        <p className="text-gray-700">
          Jump into EdgeChart now! Head to the <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link> to upload your data and start creating stunning visualisations. Have feedback or suggestions? We’d love to hear from you on our <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link> page.
        </p>
      </div>
    </div>
  );
}
