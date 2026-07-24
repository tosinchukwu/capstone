"use client";
import { useState, useEffect } from "react";

export default function WalletCreationLoader({ onSkip }: { onSkip?: () => void }) {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 10000); // Show skip after 10 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    if (onSkip) onSkip();
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Creating your wallet...</p>
        <p className="text-xs text-gray-400 mt-2">This may take a few seconds.</p>

        {showSkip && (
          <div className="mt-4 space-x-3">
            <button
              onClick={handleSkip}
              className="text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded transition"
            >
              Skip (continue anyway)
            </button>
            <button
              onClick={() => window.location.reload()}
              className="text-sm bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
