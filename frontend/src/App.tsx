import PaperList from "./components/PaperList";
import Chatbot from "./components/Chatbot";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow p-4 text-center text-2xl font-bold text-indigo-700">
        AI Research Summarizer
      </header>

      {/* Body layout: 70/30 horizontal */}
      <div className="flex flex-row flex-grow overflow-hidden">
        {/* Left - 70% */}
        <div className="w-[70%] h-full overflow-y-auto p-4 border-r border-gray-300 bg-gray-50">
          <PaperList />
        </div>

        {/* Right - 30% */}
        <div className="w-[30%] h-full overflow-y-auto p-4 bg-white">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}

export default App;
