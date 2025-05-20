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
      });
      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">🧠 Talk to Paper</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about a paper..."
        className="w-full border p-2 rounded mb-2"
        rows={3}
      ></textarea>

      <div className="flex justify-between mb-4">
        <label>
          <input
            type="checkbox"
            checked={eli5}
            onChange={() => setEli5(!eli5)}
            className="mr-2"
          />
          ELI5 Mode
        </label>
        <button
          onClick={handleAsk}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Asking..." : "Ask GPT"}
        </button>
      </div>

      {answer && (
        <div className="border p-4 rounded bg-gray-100 whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </div>
  );
};

export default Chatbot;
