'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { REPUTATION_CONTRACT_ADDRESS, REPUTATION_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';

export function ScoreQuery() {
  const [agentId, setAgentId] = useState('');
  const [shouldRead, setShouldRead] = useState(false);

  const { 
    data: score, 
    error: readError, 
    isLoading,
    refetch 
  } = useReadContract({
    address: REPUTATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: REPUTATION_ABI,
    functionName: 'getScore',
    args: agentId && shouldRead ? [BigInt(agentId)] : undefined,
    chainId: CONTRACT_CHAIN_ID,
    query: {
      enabled: Boolean(agentId) && shouldRead,
    },
  });

  const handleQuery = () => {
    if (!agentId) {
      alert('Please enter an Agent ID');
      return;
    }
    setShouldRead(true);
    // Trigger refetch after a small delay to ensure state update
    setTimeout(() => refetch(), 100);
  };

  const handleClear = () => {
    setAgentId('');
    setShouldRead(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Agent ID
        </label>
        <input
          type="number"
          value={agentId}
          onChange={(e) => {
            setAgentId(e.target.value);
            setShouldRead(false); // Reset read state when input changes
          }}
          placeholder="Enter Agent ID"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
        />
      </div>

      <button
        onClick={handleQuery}
        disabled={!agentId || isLoading}
        className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
      >
        {isLoading ? 'Querying...' : 'Query Score'}
      </button>

      {(agentId || score !== undefined) && (
        <button
          onClick={handleClear}
          disabled={isLoading}
          className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
        >
          Clear
        </button>
      )}

      {readError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-xs text-red-600 dark:text-red-400 break-all">
            {readError.message}
          </p>
        </div>
      )}

      {score !== undefined && shouldRead && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Reputation Score:
              </h4>
              <button
                onClick={() => {
                  const text = score.toString();
                  if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(() => {
                      alert('Copied to clipboard!');
                    }).catch(() => {
                      fallbackCopy(text);
                    });
                  } else {
                    fallbackCopy(text);
                  }
                  
                  function fallbackCopy(text: string) {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.left = "-999999px";
                    document.body.appendChild(textArea);
                    textArea.select();
                    try {
                      document.execCommand('copy');
                      alert('Copied to clipboard!');
                    } catch (err) {
                      alert('Copy failed. Please copy manually.');
                    }
                    document.body.removeChild(textArea);
                  }
                }}
                className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
              >
                Copy
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded p-3">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {score.toString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Agent ID: {agentId}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

