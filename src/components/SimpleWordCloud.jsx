export default function SimpleWordCloud({ words }) {
  // Calculate max and min values for scaling
  const maxValue = Math.max(...words.map(w => w.value));
  const minValue = Math.min(...words.map(w => w.value));

  return (
    <div className="word-cloud" style={{
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      padding: '16px',
      height: '100%',
      overflow: 'auto'
    }}>
      {words.map((word, i) => {
        // Scale the font size between 12px and 48px based on word frequency
        const fontSize = 12 + ((word.value - minValue) / (maxValue - minValue)) * 36;
        // Random color from a predefined palette
        const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
        const color = colors[i % colors.length];
        
        return (
          <span 
            key={i}
            style={{
              fontSize: `${fontSize}px`,
              color: color,
              opacity: 0.8,
              padding: '4px 8px',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              transform: `rotate(${Math.random() * 10 - 5}deg)`,
              cursor: 'default'
            }}
            title={`Frequency: ${word.value}`}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
