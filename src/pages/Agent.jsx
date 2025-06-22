import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";

export default function Agent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchWithTimeout = async (url, options, timeoutMs) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err instanceof Error ? err : new Error("Fetch request timed out or failed");
    }
  };

  const getDeepSeekResponse = async (userInput) => {
    try {
      const res = await fetchWithTimeout(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY || ""}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "You are EdgeAgent, an AI assistant for EdgeChart, a tool for local data visualisation and analysis. Provide concise, professional responses to help users with CSV data uploads, chart creation, statistical analysis, and troubleshooting. Emphasize that EdgeChart processes data client-side for privacy. Suggest visiting the Guide or Contact pages for further help if needed.",
              },
              { role: "user", content: userInput },
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        },
        10000
      );
      if (!res.ok) throw new Error(`DeepSeek API failed with status: ${res.status}`);
      const data = await res.json();
      return data?.choices?.[0]?.message?.content || "No response received from the API.";
    } catch (err) {
      throw err instanceof Error ? err : new Error("DeepSeek API error");
    }
  };

  const getResponse = async (userInput) => {
    const deepSeekApiKey = import.meta.env.VITE_DEEPSEEK_API_KEY || "";
    if (!deepSeekApiKey) {
      return "API key is missing. Please contact the administrator or check your configuration.";
    }
    try {
      return await getDeepSeekResponse(userInput);
    } catch (err) {
      console.error("API error:", err);
      return "Failed to get a response. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setMessages([...messages, { text: input, user: "You" }]);
    setInput("");

    try {
      const response = await getResponse(input);
      setMessages((prev) => [...prev, { text: response, user: "EdgeAgent" }]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setMessages((prev) => [...prev, { text: "Something went wrong. Please try again.", user: "EdgeAgent" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">EdgeAgent</h1>
      <p className="text-gray-700 mb-4">
        EdgeAgent is here to help you navigate EdgeChart! Ask about uploading CSV files, creating charts, understanding statistical insights, or troubleshooting issues. All data processing happens locally on your device for maximum privacy.
      </p>
      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4 bg-white shadow">
        {messages.length === 0 ? (
          <div className="text-gray-500 italic text-center py-4">
            Welcome to EdgeAgent! Ask about:
            <ul className="list-disc pl-5 mt-2 text-left">
              <li>How to upload and preview CSV data</li>
              <li>Creating and customizing charts</li>
              <li>Understanding data analysis results</li>
              <li>Fixing common errors</li>
            </ul>
            Start typing below or visit our <a href="/guide" className="text-blue-600 hover:underline">Guide</a> for more details.
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`mb-2 ${msg.user === "You" ? "text-right" : "text-left"}`}>
              <strong className={msg.user === "You" ? "text-blue-600" : "text-gray-800"}>{msg.user}:</strong> {msg.text}
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-center text-gray-400 text-sm italic py-2">
            EdgeAgent is making effort ...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 text-sm py-2">{error}</div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask EdgeAgent about EdgeChart..."
          className="flex-1 border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={isLoading || !input.trim()}
        >
          <FiSend />
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-4">
        Need more help? Check out our <a href="/guide" className="text-blue-600 hover:underline">User Guide</a> or <a href="/contact" className="text-blue-600 hover:underline">Contact Us</a>.
      </p>
    </div>
  );
}
