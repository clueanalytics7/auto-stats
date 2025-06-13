import { useState, useEffect } from 'react';
import { FiX, FiAlertCircle } from 'react-icons/fi';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setVisible(false);
    // Initialize GA here if not already done in App.jsx
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-4">
        <FiAlertCircle className="text-yellow-300 text-2xl flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to analyze traffic and improve your experience. 
            By continuing, you agree to our use of cookies and Google Analytics.
            <a href="/privacy" className="underline ml-2">Learn more</a>
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setVisible(false)}
            className="px-3 py-1 border border-gray-500 rounded text-sm"
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies}
            className="px-3 py-1 bg-blue-600 rounded text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
