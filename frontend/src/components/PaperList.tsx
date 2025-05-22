import { useState, useEffect } from "react";
import axios from "axios";

interface Paper {
  title: string;
  summary: string;
  link: string;
  authors?: string[];
}

const PaperList = () => {
  const [query, setQuery] = useState("machine learning");
  const [papers, setPapers] = useState<Paper[]>([]);
  const [eli5, setEli5] = useState(false);
  const [summaries, setSummaries] = useState<{ [title: string]: string }>({});
  const [savedPapers, setSavedPapers] = useState<Paper[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("savedPapers");
    if (stored) setSavedPapers(JSON.parse(stored));
  }, []);

  const fetchPapers = async () => {
    const res = await axios.get(`http://localhost:5000/papers?query=${query}`);
    setPapers(res.data);
  };

  const summarize = async (paper: Paper) => {
    const res = await axios.post("http://localhost:5000/summarize", {
      title: paper.title,
      summary: paper.summary,
      mode: eli5 ? "eli5" : "standard",
    });
    setSummaries((prev) => ({ ...prev, [paper.title]: res.data.summary }));
  };

  const saveToLibrary = (paper: Paper) => {
    const updated = [...savedPapers, paper];
    setSavedPapers(updated);
    localStorage.setItem("savedPapers", JSON.stringify(updated));
  };

  const deleteFromLibrary = (index: number) => {
    const updated = savedPapers.filter((_, i) => i !== index);
    setSavedPapers(updated);
    localStorage.setItem("savedPapers", JSON.stringify(updated));
  };

  const vectorize = async (paper: Paper) => {
    try {
      await axios.post("http://localhost:5000/vectorize", [paper]);
      alert("Paper vectorized! You can now ask about it in the chatbot.");
    } catch {
      alert("Failed to vectorize.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📚 Browse Research Papers</h2>

      <div className="flex items-center gap-4 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topic"
          className="flex-grow p-2 border rounded"
        />
        <button onClick={fetchPapers} className="bg-indigo-600 text-white px-4 py-2 rounded">
          Search
        </button>
        <label className="text-sm">
          <input type="checkbox" checked={eli5} onChange={() => setEli5(!eli5)} className="mr-1" />
          ELI5
        </label>
      </div>

      {papers.map((paper, index) => (
        <div key={index} className="border p-4 mb-4 bg-white rounded shadow">
          <h3 className="font-semibold text-indigo-700">{paper.title}</h3>
          <p className="text-sm text-gray-600">{paper.authors?.join(", ")}</p>
          <p className="text-sm mt-2">{paper.summary}</p>

          <div className="mt-3 flex gap-2 flex-wrap">
            <button
              onClick={() => summarize(paper)}
              className="bg-green-600 text-white px-2 py-1 rounded text-sm"
            >
              🧠 Summarize
            </button>
            <button
              onClick={() => vectorize(paper)}
              className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
            >
              💬 Talk to Paper
            </button>
            <button
              onClick={() => saveToLibrary(paper)}
              className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
            >
              💾 Save to Library
            </button>
          </div>

          {summaries[paper.title] && (
            <div className="mt-2 p-2 border bg-gray-50 text-sm rounded">
              {summaries[paper.title]}
            </div>
          )}
        </div>
      ))}

      {savedPapers.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-2 text-indigo-800">📁 Your Library</h2>
          {savedPapers.map((paper, idx) => (
            <div key={idx} className="text-sm border-b py-2 flex justify-between items-start">
              <div>
                <strong>{paper.title}</strong>
                <div className="text-xs text-gray-600">{paper.link}</div>
              </div>
              <button
                onClick={() => deleteFromLibrary(idx)}
                className="text-red-600 text-xs hover:underline"
              >
                ❌ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaperList;
