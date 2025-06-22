import { useState, useEffect, useMemo } from 'react';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
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
import ChartJSZoomPlugin from 'chartjs-plugin-zoom';
import { kernelDensityEstimation } from 'simple-statistics';
import { BoxAndWhiskers } from 'chartjs-chart-box-and-violin-plot';
import * as ss from 'simple-statistics';

// Attempt to register BoxAndWhiskers with error handling
let boxPlotRegistered = false;
try {
  console.log('Attempting to register Chart.js plugins...');
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartJSZoomPlugin,
    BoxAndWhiskers
  );
  boxPlotRegistered = true;
  console.log('BoxAndWhiskers plugin registered successfully');
} catch (err) {
  console.error('Failed to register BoxAndWhiskers plugin:', err.message, err.stack);
}

const chartTypes = ['bar', 'line', 'pie', 'scatter', 'wordcloud', 'distribution', 'boxplot', 'stats'];
const colorPalette = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#34D399'];
const highContrastPalette = ['#0000FF', '#FF0000', '#00FF00', '#FFFF00', '#FF00FF', '#00FFFF'];

export default function ChartBuilder({ data }) {
  const [activeCharts, setActiveCharts] = useState([]);
  const [chartConfigs, setChartConfigs] = useState({
    bar: { xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '' },
    line: { xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '' },
    pie: { xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '' },
    scatter: { xAxis: '', yAxis: '', xAxisLabel: '', yAxisLabel: '' },
    wordcloud: { textColumn: '' },
    distribution: { column: '' },
    boxplot: { column: '' },
    stats: { column: '' },
  });
  const [expandedChart, setExpandedChart] = useState(null);
  const [columns, setColumns] = useState([]);
  const [numericColumns, setNumericColumns] = useState([]);
  const [textColumns, setTextColumns] = useState([]);
  const [layout, setLayout] = useState('grid');
  const [highContrast, setHighContrast] = useState(false);
  const [dataLimit, setDataLimit] = useState(100);
  const [wordCloudLimit, setWordCloudLimit] = useState(100);
  const [minWordLength, setMinWordLength] = useState(2);
  const [binCount, setBinCount] = useState(10);
  const [showKDE, setShowKDE] = useState(false);
  const [presets, setPresets] = useState([]);
  const [error, setError] = useState(null);
  const [selectedWord, setSelectedWord] = useState(null);

  useEffect(() => {
    try {
      if (data.length > 0) {
        const allColumns = Object.keys(data[0]);
        const numericCols = allColumns.filter(key => {
          return data.some(row => typeof row[key] === 'number' || (!isNaN(parseFloat(row[key])) && isFinite(row[key])));
        });
        const textCols = allColumns.filter(key =>
          typeof data[0][key] === 'string' && !numericCols.includes(key)
        );

        console.log('All columns:', allColumns);
        console.log('Numeric columns:', numericCols);
        console.log('Text columns:', textCols);

        setColumns(allColumns);
        setNumericColumns(numericCols);
        setTextColumns(textCols);

        setChartConfigs({
          bar: {
            xAxis: allColumns[0] || '',
            yAxis: numericCols[0] || allColumns[0] || '',
            xAxisLabel: allColumns[0] || '',
            yAxisLabel: numericCols[0] || allColumns[0] || ''
          },
          line: {
            xAxis: allColumns[0] || '',
            yAxis: numericCols[0] || allColumns[0] || '',
            xAxisLabel: allColumns[0] || '',
            yAxisLabel: numericCols[0] || allColumns[0] || ''
          },
          pie: {
            xAxis: allColumns[0] || '',
            yAxis: numericCols[0] || allColumns[0] || '',
            xAxisLabel: allColumns[0] || '',
            yAxisLabel: numericCols[0] || allColumns[0] || ''
          },
          scatter: {
            xAxis: numericCols[0] || allColumns[0] || '',
            yAxis: numericCols[1] || numericCols[0] || allColumns[0] || '',
            xAxisLabel: numericCols[0] || allColumns[0] || '',
            yAxisLabel: numericCols[1] || numericCols[0] || allColumns[0] || ''
          },
          wordcloud: {
            textColumn: textCols[0] || allColumns[0] || ''
          },
          distribution: {
            column: numericCols[0] || allColumns[0] || ''
          },
          boxplot: {
            column: numericCols[0] || allColumns[0] || ''
          },
          stats: {
            column: allColumns[0] || ''
          }
        });
      }
    } catch (err) {
      setError('Failed to process data. Please check your input file.');
      console.error('Error in useEffect:', err);
    }
  }, [data]);

  const chartDataMap = useMemo(() => {
    const map = {};
    activeCharts.forEach(type => {
      try {
        const config = chartConfigs[type];

        switch (type) {
          case 'wordcloud':
            if (!config.textColumn) {
              console.log('Wordcloud: No text column selected');
              map[type] = null;
              return;
            }
            console.log('Wordcloud: Processing column', config.textColumn);
            console.log('Wordcloud: Raw data sample', data.slice(0, 10).map(row => row[config.textColumn]));
            const textData = {};
            data.slice(0, wordCloudLimit).forEach(row => {
              const words = (row[config.textColumn] || '').toString().split(/\s+/);
              words.forEach(word => {
                const cleanedWord = word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
                if (cleanedWord.length >= minWordLength) {
                  textData[cleanedWord] = (textData[cleanedWord] || 0) + 1;
                }
              });
            });
            const wordCloudData = Object.entries(textData)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 50)
              .map(([text, value]) => ({ text, value }));
            console.log('Wordcloud: Generated data', wordCloudData);
            map[type] = wordCloudData;
            break;

          case 'distribution':
            if (!config.column) {
              map[type] = null;
              return;
            }
            const values = data.map(row => parseFloat(row[config.column])).filter(v => !isNaN(v));
            if (values.length === 0) {
              map[type] = null;
              return;
            }
            const bins = {};
            const min = Math.min(...values);
            const max = Math.max(...values);
            const step = (max - min) / binCount;

            values.forEach(value => {
              const bin = Math.floor((value - min) / step) * step + min;
              bins[bin] = (bins[bin] || 0) + 1;
            });

            const datasets = [{
              label: `${config.column} Distribution`,
              data: Object.values(bins),
              backgroundColor: highContrast ? highContrastPalette[0] : colorPalette[0],
              borderColor: highContrast ? highContrastPalette[0].replace('0.5', '1') : colorPalette[0].replace('0.5', '1'),
              borderWidth: 1
            }];

            if (showKDE) {
              const kde = kernelDensityEstimation(values, 'gaussian', (max - min) / 100);
              datasets.push({
                label: 'Density',
                data: kde.map(([x, y]) => ({ x, y: y * values.length * step })),
                type: 'line',
                borderColor: highContrast ? highContrastPalette[1] : colorPalette[1],
                fill: false
              });
            }

            map[type] = {
              labels: Object.keys(bins).map(Number).sort((a, b) => a - b),
              datasets
            };
            break;

          case 'boxplot':
            if (!config.column) {
              console.log('Boxplot: No column selected');
              map[type] = null;
              return;
            }
            if (!boxPlotRegistered) {
              console.log('Boxplot: Plugin not registered');
              map[type] = null;
              return;
            }
            const boxplotValues = data.map(row => parseFloat(row[config.column])).filter(v => !isNaN(v));
            console.log(`Boxplot: Selected column "${config.column}", valid values count: ${boxplotValues.length}`);
            if (boxplotValues.length < 5) {
              console.log(`Boxplot: Insufficient valid data points (${boxplotValues.length}) for column "${config.column}"`);
              map[type] = null;
              return;
            }
            map[type] = {
              labels: [config.column],
              datasets: [{
                label: `Stats for ${config.column}`,
                data: [{
                  min: ss.min(boxplotValues),
                  q1: ss.quantile(boxplotValues, 0.25),
                  median: ss.median(boxplotValues),
                  q3: ss.quantile(boxplotValues, 0.75),
                  max: ss.max(boxplotValues),
                }],
                backgroundColor: highContrast ? highContrastPalette[4] : colorPalette[4],
                borderColor: 'black',
                borderWidth: 1,
              }]
            };
            break;

          case 'stats':
            if (!config.column) {
              map[type] = null;
              return;
            }
            const colData = data.map(row => row[config.column]);
            const numericData = colData.map(val => parseFloat(val)).filter(v => !isNaN(v));
            let stats = { 'Total Rows': colData.length };
            
            if (numericData.length > 0 && (numericData.length / colData.length > 0.5)) {
              Object.assign(stats, {
                'Numeric Count': numericData.length,
                'Mean': ss.mean(numericData).toFixed(3),
                'Median': ss.median(numericData).toFixed(3),
                'Std. Dev. (σ)': ss.standardDeviation(numericData).toFixed(3),
                'Min': ss.min(numericData),
                'Max': ss.max(numericData),
                'Sum': ss.sum(numericData),
              });
            } else {
              const frequencies = ss.frequency(colData.map(String));
              const uniqueCount = Object.keys(frequencies).length;
              const topValue = Object.entries(frequencies).sort((a, b) => b[1] - a[1])[0];
              Object.assign(stats, {
                'Unique Values': uniqueCount,
                'Most Frequent': `"${topValue[0]}" (${topValue[1]} times)`,
              });
            }
            map[type] = stats;
            break;

          default:
            if (!config.xAxis || !config.yAxis) {
              map[type] = null;
              return;
            }
            map[type] = {
              labels: data.slice(0, dataLimit).map((row, index) => row[config.xAxis] || `Row ${index + 1}`),
              datasets: [
                {
                  label: config.yAxisLabel || config.yAxis,
                  data: data.slice(0, dataLimit).map(row => parseFloat(row[config.yAxis]) || 0),
                  backgroundColor: type === 'pie' ? (highContrast ? highContrastPalette : colorPalette) : (highContrast ? highContrastPalette[0] : colorPalette[0]),
                  borderColor: type === 'pie' ? (highContrast ? highContrastPalette : colorPalette).map(c => c.replace('0.5', '1')) : (highContrast ? highContrastPalette[0] : colorPalette[0]).replace('0.5', '1'),
                  borderWidth: 1,
                  customData: data.slice(0, dataLimit)
                }
              ]
            };
            break;
        }
      } catch (err) {
        console.error(`Error generating chart data for ${type}:`, err);
        map[type] = null;
      }
    });
    return map;
  }, [activeCharts, chartConfigs, data, dataLimit, wordCloudLimit, minWordLength, binCount, showKDE, highContrast]);

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-8 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (data.length === 0) return null;

  const downloadChart = (chartId, format = 'png') => {
    const chartEl = document.getElementById(chartId);
    if (chartEl) {
      toPng(chartEl, { backgroundColor: '#ffffff', pixelRatio: 2 })
        .then((dataUrl) => {
          if (format === 'png') {
            const link = document.createElement('a');
            link.download = `${chartId}.png`;
            link.href = dataUrl;
            link.click();
          } else if (format === 'pdf') {
            const pdf = new jsPDF();
            pdf.addImage(dataUrl, 'PNG', 10, 10, 190, 100);
            pdf.save(`${chartId}.pdf`);
          }
        })
        .catch(err => {
          console.error('Error downloading chart:', err);
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

  const savePreset = () => {
    setPresets([...presets, { name: `Preset ${presets.length + 1}`, config: chartConfigs }]);
  };

  const loadPreset = (preset) => {
    setChartConfigs(preset.config);
  };

  const renderChartControls = (type) => {
    const config = chartConfigs[type];
    const isSingleColumn = ['wordcloud', 'distribution', 'boxplot', 'stats'].includes(type);
    
    let availableColumns = columns;
    if (type === 'wordcloud') availableColumns = textColumns;
    if (['distribution', 'boxplot'].includes(type)) availableColumns = numericColumns;

    console.log(`Rendering ${type} controls, current column: ${config[isSingleColumn ? 'column' : 'xAxis']}`);

    return (
      <div className="space-y-2 mb-3">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[120px]">
            <label className="text-sm font-medium text-gray-700">
              {isSingleColumn ? 'Column' : 'X-Axis'}
            </label>
            <select
              value={config[isSingleColumn ? 'column' : 'xAxis']}
              onChange={(e) => {
                console.log(`Changing ${type} column to: ${e.target.value}`);
                setChartConfigs(prev => {
                  const newConfig = {
                    ...prev,
                    [type]: { ...prev[type], [isSingleColumn ? 'column' : 'xAxis']: e.target.value }
                  };
                  console.log(`Updated chartConfigs for ${type}:`, newConfig[type]);
                  return newConfig;
                });
              }}
              className="border rounded-md px-2 py-1 text-sm w-full"
            >
              {availableColumns.length > 0 ? (
                availableColumns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))
              ) : (
                <option value="">No suitable columns available</option>
              )}
            </select>
          </div>
          {!isSingleColumn && type !== 'pie' && (
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium text-gray-700">X-Axis Label</label>
              <input
                type="text"
                value={config.xAxisLabel}
                onChange={(e) => setChartConfigs(prev => ({ ...prev, [type]: { ...prev[type], xAxisLabel: e.target.value } }))}
                className="border rounded-md px-2 py-1 text-sm w-full"
              />
            </div>
          )}
          {!isSingleColumn && type !== 'pie' && (
            <>
              <div className="flex-1 min-w-[120px]">
                <label className="text-sm font-medium text-gray-700">Y-Axis</label>
                <select
                  value={config.yAxis}
                  onChange={(e) => setChartConfigs(prev => ({ ...prev, [type]: { ...prev[type], yAxis: e.target.value } }))}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                >
                  {numericColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-sm font-medium text-gray-700">Y-Axis Label</label>
                <input
                  type="text"
                  value={config.yAxisLabel}
                  onChange={(e) => setChartConfigs(prev => ({ ...prev, [type]: { ...prev[type], yAxisLabel: e.target.value } }))}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                />
              </div>
            </>
          )}
          {type === 'wordcloud' && (
            <>
              <div className="flex-1 min-w-[120px]">
                <label className="text-sm font-medium text-gray-700">Max Words</label>
                <input
                  type="number"
                  value={wordCloudLimit}
                  onChange={(e) => setWordCloudLimit(parseInt(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                  min="10"
                  max="1000"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="text-sm font-medium text-gray-700">Min Word Length</label>
                <input
                  type="number"
                  value={minWordLength}
                  onChange={(e) => setMinWordLength(parseInt(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                  min="1"
                  max="10"
                />
              </div>
            </>
          )}
          {type === 'distribution' && (
            <>
              <div className="flex-1 min-w-[120px]">
                <label className="text-sm font-medium text-gray-700">Number of Bins</label>
                <input
                  type="number"
                  value={binCount}
                  onChange={(e) => setBinCount(parseInt(e.target.value))}
                  className="border rounded-md px-2 py-1 text-sm w-full"
                  min="5"
                  max="50"
                />
              </div>
              <div className="flex-1 min-w-[120px] flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showKDE}
                    onChange={(e) => setShowKDE(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Show KDE</span>
                </label>
              </div>
            </>
          )}
          {!isSingleColumn && (
            <div className="flex-1 min-w-[120px]">
              <label className="text-sm font-medium text-gray-700">Data Limit</label>
              <input
                type="number"
                value={dataLimit}
                onChange={(e) => setDataLimit(parseInt(e.target.value))}
                className="border rounded-md px-2 py-1 text-sm w-full"
                min="10"
                max="1000"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChart = (type) => {
    const chartData = chartDataMap[type];
    if (!chartData) {
      let errorMessage = `Invalid or missing data for ${type} chart. Please select valid columns.`;
      if (type === 'boxplot') {
        if (!chartConfigs[type].column) {
          errorMessage = 'No column selected for boxplot. Please select a numeric column.';
        } else if (!boxPlotRegistered) {
          errorMessage = 'Boxplot chart is not supported due to a plugin error. Please try another chart type.';
        } else if (data.map(row => parseFloat(row[chartConfigs[type].column])).filter(v => !isNaN(v)).length < 5) {
          errorMessage = `Insufficient valid numeric data for column "${chartConfigs[type].column}" in boxplot. At least 5 numeric values are required.`;
        }
      } else if (type === 'wordcloud') {
        if (!chartConfigs[type].textColumn) {
          errorMessage = 'No text column selected for word cloud. Please select a text column.';
        } else if (!textColumns.includes(chartConfigs[type].textColumn)) {
          errorMessage = `Selected column "${chartConfigs[type].textColumn}" is not a valid text column.`;
        }
      }
      console.log(`Rendering ${type} chart error: ${errorMessage}`);
      return (
        <div
          id={`chart-${type}`}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center text-red-600"
          role="figure"
          aria-label={`Invalid ${type} chart`}
        >
          {errorMessage}
        </div>
      );
    }

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { family: 'Arial', size: 14 }, color: '#000' }
        },
        title: {
          display: true,
          text: chartConfigs[type].column
            ? `${type.charAt(0).toUpperCase() + type.slice(1)} of ${chartConfigs[type].column}`
            : `${chartConfigs[type].yAxisLabel || chartConfigs[type].yAxis} by ${chartConfigs[type].xAxisLabel || chartConfigs[type].xAxis}`,
          font: { family: 'Arial', size: 16, weight: 'bold' },
          color: '#000'
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { family: 'Arial', size: 12 },
          bodyFont: { family: 'Arial', size: 12 },
          callbacks: {
            label: (context) => {
              const row = context.dataset.customData?.[context.dataIndex];
              const basicLabel = `${context.dataset.label || ''}: ${context.parsed.y || context.parsed}`;
              if (!row) return basicLabel;
              const details = Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(' | ');
              return `${basicLabel} (${details})`;
            }
          }
        },
        zoom: ['line', 'scatter', 'distribution', 'boxplot'].includes(type) ? {
          zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'xy' },
          pan: { enabled: true, mode: 'xy' }
        } : undefined
      },
      scales: (type !== 'pie' && type !== 'wordcloud' && type !== 'stats') ? {
        x: {
          title: {
            display: true,
            text: chartConfigs[type].xAxisLabel || chartConfigs[type].xAxis || chartConfigs[type].column,
            font: { family: 'Arial', size: 14 },
            color: '#000'
          },
          ticks: { font: { family: 'Arial', size: 12 }, color: '#333' },
          grid: { color: '#ddd' }
        },
        y: {
          title: {
            display: true,
            text: chartConfigs[type].yAxisLabel || chartConfigs[type].yAxis,
            font: { family: 'Arial', size: 14 },
            color: '#000'
          },
          ticks: { font: { family: 'Arial', size: 12 }, color: '#333' },
          grid: { color: '#ddd' }
        }
      } : {}
    };

    if (type === 'stats') {
      return (
        <div
          id={`chart-${type}`}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold capitalize text-gray-900">Statistics Summary</h3>
            <div className="flex gap-2">
              <button
                onClick={() => downloadChart(`chart-${type}`, 'png')}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
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
          <div className="h-64 overflow-y-auto pt-2">
            <h4 className="font-bold text-md mb-2 text-gray-800">{chartConfigs.stats.column}</h4>
            <table className="w-full text-left text-sm">
              <tbody>
                {Object.entries(chartData).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 font-medium text-gray-600">{key}</td>
                    <td className="py-2 text-gray-900 font-mono">{value.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    try {
      return (
        <div
          id={`chart-${type}`}
          className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${expandedChart === type ? 'col-span-2 row-span-2' : ''}`}
          role="figure"
          aria-label={`${type} chart of selected data`}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold capitalize text-gray-900">{type} Chart</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setExpandedChart(expandedChart === type ? null : type)}
                className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              >
                {expandedChart === type ? 'Collapse' : 'Expand'}
              </button>
              <select
                onChange={(e) => downloadChart(`chart-${type}`, e.target.value)}
                className="border rounded-md px-2 py-1 text-xs"
              >
                <option value="png">Download PNG</option>
                <option value="pdf">Download PDF</option>
              </select>
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
            {type === 'boxplot' && boxPlotRegistered && <Bar type="boxplot" data={chartData} options={options} />}
            {type === 'wordcloud' && (
              <SimpleWordCloud words={chartData} onWordClick={(word) => setSelectedWord(word.text)} />
            )}
          </div>
        </div>
      );
    } catch (err) {
      console.error(`Error rendering chart ${type}:`, err);
      return (
        <div
          id={`chart-${type}`}
          className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 text-center text-red-600"
          role="figure"
          aria-label={`Error in ${type} chart`}
        >
          Error rendering {type} chart. Please try different settings.
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      {selectedWord && (
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-blue-700">
            Selected word: <strong>{selectedWord}</strong>
          </p>
          <button
            onClick={() => setSelectedWord(null)}
            className="mt-2 px-3 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
          >
            Clear Selection
          </button>
        </div>
      )}
      <div className="p-4 bg-gray-50 rounded-lg border">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700 mr-2">Chart Library:</span>
          {chartTypes.map(type => (
            <div key={type} className="relative group">
              <button
                onClick={() => toggleChart(type)}
                className={`px-3 py-1 rounded-md text-sm capitalize transition-colors ${
                  activeCharts.includes(type) ? 'bg-blue-500 text-white shadow' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {type}
              </button>
              <span className="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 z-10 w-max shadow-lg">
                {type === 'bar'
                  ? 'Compare values across categories'
                  : type === 'line'
                  ? 'Show trends over time'
                  : type === 'pie'
                  ? 'Display proportional data'
                  : type === 'scatter'
                  ? 'Visualize relationships between variables'
                  : type === 'wordcloud'
                  ? 'Show word frequency'
                  : type === 'distribution'
                  ? 'Show data distribution (histogram)'
                  : type === 'boxplot'
                  ? 'Visualize data quartiles & outliers'
                  : type === 'stats'
                  ? 'Show a descriptive statistics summary'
                  : ''}
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t">
          <span className="font-semibold text-gray-700 mr-2">Controls:</span>
          <button
            onClick={() => setLayout(layout === 'grid' ? 'single' : 'grid')}
            className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
          >
            Toggle {layout === 'grid' ? 'Single Column' : 'Grid'} View
          </button>
          <button
            onClick={() => setHighContrast(!highContrast)}
            className="px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300"
          >
            Toggle High Contrast
          </button>
          <button
            onClick={savePreset}
            className="px-3 py-1 rounded-md text-sm bg-green-200 hover:bg-green-300"
          >
            Save Preset
          </button>
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => loadPreset(preset)}
              className="px-3 py-1 rounded-md text-sm bg-blue-200 hover:bg-blue-300"
            >
              Load {preset.name}
            </button>
          ))}
        </div>
      </div>

      {activeCharts.length > 0 ? (
        <div className={`gap-4 ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2' : 'space-y-4'}`}>
          {activeCharts.map(type => (
            <div key={type}>{renderChart(type)}</div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center border-2 border-dashed">
          <h3 className="text-xl font-semibold text-gray-700">Your Dashboard is Empty</h3>
          <p className="text-gray-500 mt-2">Add a chart from the library above to begin your analysis.</p>
        </div>
      )}
    </div>
  );
}
