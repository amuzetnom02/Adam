import { useState } from "react";
import BlockchainConsoleUI from "../components/BlockchainConsoleUI";
import DashboardComponent from "../components/DashboardComponent";
import AuthComponent from "../components/AuthComponent";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Toaster } from "react-hot-toast";

export default function Home() {
  const [currentView, setCurrentView] = useState("dashboard");

  return (
    <ThirdwebProvider activeChain="ethereum">
      <div className="min-h-screen bg-[#e0e5ec] p-4 md:p-8">
        <div className="container mx-auto">
          <header className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Adam AI Blockchain Agent</h1>
            
            <nav className="flex space-x-4">
              <button 
                onClick={() => setCurrentView("dashboard")}
                className={`py-2 px-4 rounded-xl ${currentView === "dashboard" 
                  ? "bg-[#e0e5ec] text-blue-600 shadow-neumorph" 
                  : "text-gray-600"}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView("console")}
                className={`py-2 px-4 rounded-xl ${currentView === "console" 
                  ? "bg-[#e0e5ec] text-blue-600 shadow-neumorph" 
                  : "text-gray-600"}`}
              >
                Console
              </button>
              <button 
                onClick={() => setCurrentView("auth")}
                className={`py-2 px-4 rounded-xl ${currentView === "auth" 
                  ? "bg-[#e0e5ec] text-blue-600 shadow-neumorph" 
                  : "text-gray-600"}`}
              >
                Account
              </button>
            </nav>
          </header>
          
          <main className="mb-8">
            {currentView === "dashboard" && <DashboardComponent />}
            {currentView === "console" && <BlockchainConsoleUI />}
            {currentView === "auth" && <AuthComponent />}
          </main>
          
          <footer className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Adam AI Blockchain Agent • All Rights Reserved
          </footer>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </ThirdwebProvider>
  );
}