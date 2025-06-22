export default function SimpleWordCloud({ words, onWordClick }) {
  const maxValue = Math.max(...words.map(w => w.value));
  const minValue = Math.min(...words.map(w => w.value));

  return (
    <div 
      className="word-cloud flex flex-wrap justify-center items-center h-full overflow-hidden"
      role="list"
      aria-label="Word cloud visualization"
      style={{ padding: '10px' }}
    >
      {words.map((word, i) => {
        const fontSize = 12 + Math.log2(word.value / minValue) * 8;
        const hue = (i * 137.508) % 360;
        return (
          <span
            key={i}
            role="listitem"
            style={{
              fontSize: `${fontSize}px`,
              color: `hsl(${hue}, 70%, 50%)`,
              transition: 'all 0.3s ease',
              fontFamily: 'Inter, sans-serif',
              margin: '4px'
            }}
            className="inline-block hover:scale-110 hover:opacity-100 cursor-pointer"
            aria-label={`${word.text}: Frequency ${word.value}`}
            onClick={() => onWordClick && onWordClick(word)}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
}
