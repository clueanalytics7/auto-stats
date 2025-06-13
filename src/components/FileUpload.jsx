import { useCallback } from 'react';
import { FiUpload } from 'react-icons/fi';

export default function FileUpload({ onDataLoaded, compact = false }) {
  const handleFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split('\n');
        const headers = lines[0].split(',');
        const rows = lines.slice(1).map(line => {
          const values = line.split(',');
          return headers.reduce((obj, header, i) => {
            obj[header.trim()] = values[i] ? values[i].trim() : '';
            return obj;
          }, {});
        });
        onDataLoaded(rows.filter(row => Object.values(row).some(v => v)));
      } catch (error) {
        onDataLoaded([]);
      }
    };
    reader.readAsText(file);
  }, [onDataLoaded]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files.length) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg ${compact ? 'p-2' : 'p-8'} text-center cursor-pointer hover:border-blue-400 transition-colors`}
    >
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleChange} 
        className="hidden" 
        id="file-upload"
      />
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center">
        <FiUpload className={`${compact ? 'h-5 w-5' : 'h-8 w-8'} text-blue-500 mb-1`} />
        <span className={`${compact ? 'text-sm' : 'text-base'} text-gray-600`}>
          {compact ? 'Drop CSV or click to upload' : 'Drag & drop your CSV file here or click to browse'}
        </span>
        {compact ? null : (
          <p className="text-xs text-gray-500 mt-2">Supports comma-separated CSV files</p>
        )}
      </label>
    </div>
  );
}
