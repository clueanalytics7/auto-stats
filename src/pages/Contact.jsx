// /home/edgechart/src/pages/Contact.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    inquiryType: "general", // Keeping this as 'general' default for consistency
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // IMPORTANT: Ensure this URL is correct and your Google Apps Script is deployed as a web app with 'Anyone' access.
  // This is the URL to your deployed Google Apps Script web app.
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxbKvo_PY1U67Wv-ZWLMVFKLCobPcGlRqcrv5SJKLVUyUlHm1RtS3ZOzrF2eSksuesR/exec';

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSubmitted(false); // Reset submitted state

    const { name, email, message, inquiryType } = formData;

    // Client-side validation
    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true); // Start loading state

    try {
      // First, try a standard POST request
      let postAttemptSuccessful = false;
      try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Sending data as JSON
          },
          body: JSON.stringify({ name, email, message, inquiryType }), // Send inquiryType as well
          credentials: 'omit' // Omit credentials to prevent CORS issues if not needed by the script
        });

        // Parse the JSON response from the Apps Script
        const result = await response.json();

        if (response.ok && result.success) {
          // If HTTP status is OK and Apps Script reported success
          setSubmitted(true);
          setFormData({ name: "", email: "", message: "", inquiryType: "general" }); // Clear form
          postAttemptSuccessful = true;
        } else {
          // If Apps Script reported an error or HTTP status was not OK
          setError(result.message || `POST failed with status ${response.status}.`);
          console.error('POST error:', result.message || response.statusText);
        }
      } catch (postError) {
        console.warn('POST attempt failed (network/CORS/parsing error), falling back to JSONP:', postError);
        // postAttemptSuccessful remains false, proceeding to JSONP
      }

      // Only attempt JSONP fallback if POST was not successful
      if (!postAttemptSuccessful) {
        console.log("Attempting JSONP fallback...");
        await submitViaJsonp();
        setSubmitted(true);
        setFormData({ name: "", email: "", message: "", inquiryType: "general" }); // Clear form
      }

    } catch (err) {
      // This catch block will only execute if JSONP also fails
      console.error('Submission error (JSONP fallback failed):', err);
      setError("Failed to send message. Please try again later. Check console for details.");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  const submitViaJsonp = () => {
    return new Promise((resolve, reject) => {
      const callbackName = `jsonp_${Date.now()}`;
      const script = document.createElement('script');

      window[callbackName] = (response) => {
        cleanup();
        if (response && response.success) {
          resolve(response);
        } else {
          // Changed error message for JSONP
          reject(new Error(response?.message || 'JSONP submission failed: server did not report success.'));
        }
      };

      const cleanup = () => {
        delete window[callbackName];
        if (document.body.contains(script)) {
            document.body.removeChild(script);
        }
      };

      script.onerror = () => {
        cleanup();
        reject(new Error('Network error during JSONP request. This might be a temporary network issue or an unreachable script.'));
      };

      const params = new URLSearchParams();
      params.append('callback', callbackName);
      params.append('name', formData.name);
      params.append('email', formData.email);
      params.append('message', formData.message);
      params.append('inquiryType', formData.inquiryType);

      script.src = `${GOOGLE_SCRIPT_URL}?${params.toString()}`;
      document.body.appendChild(script);
    });
  };

  return (
    <div className="section bg-white py-16">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-blue-900">
            Contact Us
          </h1>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Have a question, feedback, or a data request? Reach out to us using the form below.
            Select your inquiry type to help us direct your message to the right team, and we'll get back to you as soon as possible.
            
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-4 mb-6 rounded-lg bg-green-50 border border-green-200">
                <p className="text-green-700 font-medium">
                  Thank you for your message! We'll be in touch soon.
                </p>
              </div>
              <button
                onClick={() => setSubmitted(false)}
                className="btn bg-gray-500 hover:bg-gray-600 text-white"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm" role="alert" id="form-error">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1">
                  Inquiry Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                  required
                  disabled={isLoading}
                >
                  <option value="general">General Inquiry</option>
                  <option value="dataRequest">Data Request (GDPR)</option>
                  <option value="feedback">Feedback / Suggestion</option>
                  <option value="collaboration">Collaboration Inquiry</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                  required
                  disabled={isLoading}
                  aria-describedby={error ? "form-error" : undefined}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition duration-200"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full px-6 py-3 rounded-lg bg-gray-500 text-white font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : "Send Message"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
