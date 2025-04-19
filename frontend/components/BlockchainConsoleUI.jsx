import { auth, db } from "../firebase";
import { useAddress, ConnectWallet } from "@thirdweb-dev/react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function BlockchainConsoleUI() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const address = useAddress();

  const handleConsoleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    setLoading(true);
    
    try {
      // First, send to AI to parse intent
      const aiResponse = await axios.post("/api/ai", { prompt: input });
      
      // Then execute the parsed blockchain action
      const actionResult = await axios.post("/api/blockchain", aiResponse.data);
      
      // Add the result to the console history
      setResults(prev => [...prev, {
        input,
        output: actionResult.data,
        timestamp: new Date().toISOString()
      }]);
      
      toast.success("Command executed successfully");
    } catch (error) {
      console.error("Console error:", error);
      
      // Add the error to the console history
      setResults(prev => [...prev, {
        input,
        error: error.response?.data?.error || error.message,
        timestamp: new Date().toISOString()
      }]);
      
      toast.error("Failed to execute command");
    } finally {
      setLoading(false);
      setInput("");
    }
  };
  
  return (
    <div className="min-h-screen bg-[#e0e5ec] text-gray-800 p-6 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Blockchain Console</h1>
          <ConnectWallet theme="dark" />
        </div>
        
        {/* Console Input */}
        <form onSubmit={handleConsoleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a blockchain command..."
              className="w-full p-4 pl-6 pr-24 rounded-xl bg-[#e0e5ec] shadow-neumorph focus:outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 py-2 px-4 rounded-lg ${
                loading ? 'opacity-50' : ''
              } bg-[#e0e5ec] shadow-neumorph active:shadow-neumorph-inset`}
            >
              {loading ? 'Processing...' : 'Execute'}
            </button>
          </div>
        </form>
        
        {/* Console Output */}
        <div className="p-6 rounded-xl bg-[#e0e5ec] shadow-neumorph overflow-auto max-h-[60vh]">
          <h2 className="text-xl font-semibold mb-4">Console Results</h2>
          
          {results.length === 0 ? (
            <div className="text-gray-500 italic">No commands executed yet...</div>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="p-4 rounded-lg bg-[#e0e5ec] shadow-neumorph">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">$ {result.input}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    result.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                  }`}>
                    {result.error ? (
                      <div className="font-mono">Error: {result.error}</div>
                    ) : (
                      <pre className="font-mono whitespace-pre-wrap">
                        {JSON.stringify(result.output, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}