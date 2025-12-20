'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { hexToString } from 'viem';

export function MetadataQuery() {
  const [agentId, setAgentId] = useState('');
  const [queryResult, setQueryResult] = useState<string | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  // Read metadata
  const { data: readMetadata, isLoading: isReading, error: readError, refetch } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'getMetadata',
    args: agentId ? [BigInt(agentId), 'document'] as const : undefined,
    chainId: CONTRACT_CHAIN_ID,
    query: {
      enabled: false,
    },
  });

  const handleQuery = async () => {
    if (!agentId) return;

    setIsQuerying(true);
    try {
      const result = await refetch();
      if (result.data) {
        // Convert hex to string
        const hexData = result.data as `0x${string}`;
        const decodedValue = hexToString(hexData);
        setQueryResult(decodedValue);
      }
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Agent ID
        </label>
        <input
          type="number"
          value={agentId}
          onChange={(e) => {
            setAgentId(e.target.value);
            setQueryResult(null);
          }}
          placeholder="Enter agent ID"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          The agent ID to query metadata for
        </p>
      </div>

      <button
        onClick={handleQuery}
        disabled={!agentId || isQuerying || isReading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isQuerying || isReading ? 'Querying...' : 'Query Metadata'}
      </button>

      {readError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
            ❌ Query Failed
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 break-all">
            {readError.message}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Tip: Query fails if Agent ID doesn&apos;t exist or metadata hasn&apos;t been set
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

