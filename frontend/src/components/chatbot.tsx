import { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [eli5, setEli5] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/ask", {
        question: question,
        mode: eli5 ? "eli5" : "standard",
      });
      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer("❌ Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white shadow-xl rounded-lg p-8 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        🤖 Talk to Paper
      </h2>

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something like 'What is this paper about?'"
        className="w-full p-4 border rounded-lg text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        rows={4}
      />

      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={eli5}
            onChange={() => setEli5(!eli5)}
            className="form-checkbox h-4 w-4 text-indigo-600"
          />
          <span>ELI5 Mode (Explain Like I’m 5)</span>
        </label>
        <button
          onClick={handleAsk}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-md shadow-sm transition duration-200"
        >
          {loading ? "Thinking..." : "Ask GPT"}
        </button>
      </div>

      {answer && (
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg text-gray-800 leading-relaxed whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
