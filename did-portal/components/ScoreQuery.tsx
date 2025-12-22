'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { REPUTATION_CONTRACT_ADDRESS, REPUTATION_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { didToAgentId } from '@/lib/uuid-helper';

export function ScoreQuery() {
  const [didInput, setDidInput] = useState('');
  const [score, setScore] = useState<bigint | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<bigint | null>(null);

  // Read score
  const { data: readScore, isLoading: isReading, error: readError, refetch } = useReadContract({
    address: REPUTATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: REPUTATION_ABI,
    functionName: 'getScore',
    args: agentId ? [agentId] as const : undefined,
    chainId: CONTRACT_CHAIN_ID,
    query: {
      enabled: false,
    },
  });

  const handleQuery = async () => {
    if (!didInput.trim()) {
      setError('Please enter a DID');
      return;
    }

    try {
      setError(null);
      const id = didToAgentId(didInput);
      setAgentId(id);
      
      setIsQuerying(true);
      const result = await refetch();
      if (result.data) {
        setScore(result.data as bigint);
      }
    } catch (err: any) {
      console.error('Query failed:', err);
      setError(err.message || 'Invalid DID format');
    } finally {
      setIsQuerying(false);
    }
  };

  const handleClear = () => {
    setDidInput('');
    setScore(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Agent DID
        </label>
        <input
          type="text"
          value={didInput}
          onChange={(e) => {
            setDidInput(e.target.value);
            setScore(null);
            setError(null);
          }}
          placeholder="did:codatta:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter the agent DID to query reputation score
        </p>
      </div>

      <button
        onClick={handleQuery}
        disabled={!didInput.trim() || isQuerying || isReading}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isQuerying || isReading ? 'Querying...' : 'Query Score'}
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
            ❌ Error
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 break-all">
            {error}
          </p>
        </div>
      )}

      {readError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
            ❌ Query Failed
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 break-all">
            {readError.message}
          </p>
        </div>
      )}

      {(score !== null || readScore) && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Reputation Score:
            </h4>
            <button
              onClick={() => {
                const text = (score || readScore)?.toString() || '';
                if (navigator.clipboard && window.isSecureContext) {
                  navigator.clipboard.writeText(text);
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
                  } catch (err) {
                    console.error('Copy failed:', err);
                  }
                  document.body.removeChild(textArea);
                }
              }}
              className="text-xs text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-medium"
            >
              Copy
            </button>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">
            {(score || readScore)?.toString() || '0'}
          </p>
        </div>
      )}

      {(score !== null || (readScore !== undefined && readScore !== null)) && (
        <button
          onClick={handleClear}
          className="w-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Clear
        </button>
      )}
    </div>
  );
}
