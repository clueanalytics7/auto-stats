export default function SupportBanner() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg border border-blue-200 shadow-sm">
        <div className="flex items-center gap-2">
          <a 
            href="https://coff.ee/clueanalytq" 
            target="_blank"
            rel="noopener noreferrer"
            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-md text-xs flex items-center gap-1 transition-colors"
            title="Support our work"
          >
            <span>☕ Support Our Work</span>
          </a>
        </div>
      </div>
    </div>
  );
}
