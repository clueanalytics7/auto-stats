import { useState, useEffect } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { toPng } from 'html-to-image';
import SimpleWordCloud from './SimpleWordCloud';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const chartTypes = ['bar', 'line', 'pie', 'scatter', 'wordcloud', 'distribution'];

export default function ChartBuilder({ data }) {
  const [activeCharts, setActiveCharts] = useState([]);
  const [chartConfigs, setChartConfigs] = useState({
    bar: { xAxis: '', yAxis: '' },
    line: { xAxis: '', yAxis: '' },
    pie: { xAxis: '', yAxis: '' },
    scatter: { xAxis: '', yAxis: '' },
    wordcloud: { textColumn: '' },
    distribution: { column: '' }
  });
  const [expandedChart, setExpandedChart] = useState(null);
  const [columns, setColumns] = useState([]);
  const [numericColumns, setNumericColumns] = useState([]);
  const [textColumns, setTextColumns] = useState([]);

  useEffect(() => {
    if (data.length > 0) {
      const allColumns = Object.keys(data[0]);
      const numericCols = allColumns.filter(key => {
        return typeof data[0][key] === 'number' || !isNaN(parseFloat(data[0][key]));
      });
      const textCols = allColumns.filter(key => 
        typeof data[0][key] === 'string' && 
        !numericCols.includes(key)
      );

      setColumns(allColumns);
      setNumericColumns(numericCols);
      setTextColumns(textCols);

      // Initialize default configurations
      setChartConfigs({
        bar: { 
          xAxis: numericCols[0] || allColumns[0] || '', 
          yAxis: numericCols[1] || numericCols[0] || allColumns[0] || '' 
        },
        line: { 
          xAxis: numericCols[0] || allColumns[0] || '', 
          yAxis: numericCols[1] || numericCols[0] || allColumns[0] || '' 
        },
        pie: { 
          xAxis: allColumns[0] || '', 
          yAxis: numericCols[0] || allColumns[0] || '' 
        },
        scatter: {
          xAxis: numericCols[0] || allColumns[0] || '',
          yAxis: numericCols[1] || numericCols[0] || allColumns[0] || ''
        },
        wordcloud: {
          textColumn: textCols[0] || allColumns[0] || ''
        },
        distribution: {
          column: numericCols[0] || allColumns[0] || ''
        }
      });
    }
  }, [data]);

  if (data.length === 0) return null;

  const generateChartData = (type) => {
    const config = chartConfigs[type];
    
    switch (type) {
      case 'wordcloud':
        if (!config.textColumn) return null;
        const textData = {};
        data.slice(0, 100).forEach(row => {
          const words = (row[config.textColumn] || '').toString().split(/\s+/);
          words.forEach(word => {
            const cleanedWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (cleanedWord.length > 2) {
              textData[cleanedWord] = (textData[cleanedWord] || 0) + 1;
            }
          });
        });
        return Object.entries(textData)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 50)
          .map(([text, value]) => ({ text, value }));

      case 'distribution':
        if (!config.column) return null;
        const values = data.map(row => parseFloat(row[config.column])).filter(v => !isNaN(v));
        const bins = {};
        const min = Math.min(...values);
        const max = Math.max(...values);
        const step = (max - min) / 10;
        
        values.forEach(value => {
          const bin = Math.floor((value - min) / step) * step + min;
          bins[bin] = (bins[bin] || 0) + 1;
        });

        return {
          labels: Object.keys(bins).map(Number).sort((a, b) => a - b),
          datasets: [{
            label: `${config.column} Distribution`,
            data: Object.values(bins),
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        };

      default:
        if (!config.xAxis || !config.yAxis) return null;
        return {
          labels: data.slice(0, 100).map((row, index) => row[config.xAxis] || `Row ${index + 1}`),
          datasets: [
            {
              label: config.yAxis,
              data: data.slice(0, 100).map(row => parseFloat(row[config.yAxis]) || 0),
              backgroundColor: type === 'pie' 
                ? ['rgba(59, 130, 246, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)']
                : 'rgba(59, 130, 246, 0.5)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 1,
            },
          ],
        };
    }
  };

  const downloadChart = (chartId) => {
    const chartEl = document.getElementById(chartId);
    if (chartEl) {
      toPng(chartEl).then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `${chartId}.png`;
        link.href = dataUrl;
        link.click();
      });
    }
  };

  const toggleChart = (type) => {
    if (activeCharts.includes(type)) {
      setActiveCharts(activeCharts.filter(t => t !== type));
    } else {
      setActiveCharts([...activeCharts, type]);
    }
  };

  const renderChartControls = (type) => {
    const config = chartConfigs[type];
    const availableColumns = type === 'wordcloud' ? textColumns : 
                           type === 'distribution' ? numericColumns : columns;

    return (
      <div className="space-y-2 mb-3">
        <div className="flex gap-2">
          <select
            value={config[type === 'wordcloud' ? 'textColumn' : 
                  type === 'distribution' ? 'column' : 'xAxis']}
            onChange={(e) => setChartConfigs(prev => ({
              ...prev,
              [type]: { ...prev[type], 
                [type === 'wordcloud' ? 'textColumn' : 
                 type === 'distribution' ? 'column' : 'xAxis']: e.target.value 
              }
            }))}
            className="border rounded-md px-2 py-1 text-sm w-full"
          >
            {availableColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
          {!['wordcloud', 'distribution', 'pie'].includes(type) && (
            <select
              value={config.yAxis}
              onChange={(e) => setChartConfigs(prev => ({
                ...prev,
                [type]: { ...prev[type], yAxis: e.target.value }
              }))}
              className="border rounded-md px-2 py-1 text-sm w-full"
            >
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  const renderChart = (type) => {
    const chartData = generateChartData(type);
    if (!chartData) return null;

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        title: {
          display: true,
          text: type === 'wordcloud' ? `Word Cloud: ${chartConfigs.wordcloud.textColumn}` :
                type === 'distribution' ? `Distribution: ${chartConfigs.distribution.column}` :
                `${chartConfigs[type].yAxis} by ${chartConfigs[type].xAxis}`,
        },
      },
    };

    return (
      <div 
        id={`chart-${type}`}
        className={`bg-white p-3 rounded-lg shadow ${
          expandedChart === type ? 'col-span-2 row-span-2' : ''
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold capitalize">{type} Chart</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setExpandedChart(expandedChart === type ? null : type)}
              className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
            >
              {expandedChart === type ? 'Collapse' : 'Expand'}
            </button>
            <button
              onClick={() => downloadChart(`chart-${type}`)}
              className="px-2 py-1 text-xs bg-blue-100 rounded hover:bg-blue-200"
            >
              Download
            </button>
            <button
              onClick={() => toggleChart(type)}
              className="px-2 py-1 text-xs bg-red-100 rounded hover:bg-red-200"
            >
              Remove
            </button>
          </div>
        </div>
        {renderChartControls(type)}
        <div className="h-64">
          {type === 'bar' && <Bar data={chartData} options={options} />}
          {type === 'line' && <Line data={chartData} options={options} />}
          {type === 'pie' && <Pie data={chartData} options={options} />}
          {type === 'scatter' && <Scatter data={chartData} options={options} />}
          {type === 'distribution' && <Bar data={chartData} options={options} />}
          {type === 'wordcloud' && <SimpleWordCloud words={chartData} />}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {chartTypes.map(type => (
          <button
            key={type}
            onClick={() => toggleChart(type)}
            className={`px-3 py-1 rounded-md text-sm ${
              activeCharts.includes(type)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {activeCharts.includes(type) ? `${type} chart added` : `Add ${type} chart`}
          </button>
        ))}
      </div>

      {activeCharts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeCharts.map(type => renderChart(type))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">No charts added. Select a chart type above.</p>
        </div>
      )}
    </div>
  );
}
