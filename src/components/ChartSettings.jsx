// ChartSettings.jsx
export default function ChartSettings({ chartType, onConfigUpdate }) {
  const [showGrid, setShowGrid] = useState(true);
  
  return (
    <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
      <label className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={showGrid} 
          onChange={(e) => {
            setShowGrid(e.target.checked);
            onConfigUpdate({ showGrid: e.target.checked });
          }} 
        />
        Show grid lines
      </label>
    </div>
  );
}
