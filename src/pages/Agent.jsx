// src/pages/Agent.jsx
import { useState } from "react";
import { FiSend } from "react-icons/fi";

export default function Agent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, user: "You" }]);
    // Mock AI response (replace with actual API call)
    setTimeout(() => {
      setMessages(prev => [...prev, { text: "Here’s how to analyze your data: ...", user: "Clue Agent" }]);
    }, 1000);
    setInput("");
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clue Agent</h1>
      <div className="border rounded-lg p-4 h-96 overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.user === "You" ? "text-right" : ""}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about data analysis..."
          className="flex-1 border rounded p-2"
        />
        <button onClick={handleSend} className="bg-blue-500 text-white p-2 rounded">
          <FiSend />
        </button>
      </div>
    </div>
  );
}
