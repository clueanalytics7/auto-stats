import { FiDownload } from 'react-icons/fi';

export default function ExportData({ data }) {
  const exportToCSV = () => {
    const headers = Object.keys(data[0]).join(',');
    const csvContent = [
      headers,
      ...data.map(row => Object.values(row).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'analysis-results.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button 
      onClick={exportToCSV}
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2 text-sm"
      aria-label="Export analysis results"
    >
      <FiDownload className="inline" />
      Export Results
    </button>
  );
}
