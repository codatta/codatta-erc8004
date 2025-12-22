'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { hexToString } from 'viem';
import { didToAgentId } from '@/lib/uuid-helper';

export function MetadataQuery() {
  const [didInput, setDidInput] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agentId, setAgentId] = useState<bigint | null>(null);

  // Read metadata
  const { data: readMetadata, isLoading: isReading, error: readError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getMetadata',
    args: agentId ? [agentId, 'document'] as const : undefined,
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
        // Convert hex to string
        const hexData = result.data as `0x${string}`;
        const decodedValue = hexToString(hexData);
        setQueryResult(decodedValue);
      }
    } catch (err: any) {
      console.error('Query failed:', err);
      setError(err.message || 'Invalid DID format');
    } finally {
      setIsQuerying(false);
    }
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
            setQueryResult(null);
            setError(null);
          }}
          placeholder="did:codatta:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          The agent DID to query metadata for
        </p>
      </div>

      <button
        onClick={handleQuery}
        disabled={!didInput.trim() || isQuerying || isReading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isQuerying || isReading ? 'Querying...' : 'Query Metadata'}
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

      {(queryResult || readMetadata) && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Document URL (key: &quot;document&quot;):
            </h4>
            <button
              onClick={() => {
                const text = (queryResult || readMetadata) as string;
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
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Copy
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 break-all">
            <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
              {queryResult || readMetadata}
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          💡 Note: Queries the &quot;document&quot; key from agent metadata
        </p>
      </div>
    </div>
  );
}

