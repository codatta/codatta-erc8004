'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';

export function TokenUriQuery() {
  const [tokenIdToRead, setTokenIdToRead] = useState('');
  const [shouldRead, setShouldRead] = useState(false);

  // Read tokenURI
  const { data: readTokenUri, isLoading: isReading, error: readError } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: CONTRACT_ABI,
    functionName: 'tokenURI',
    args: tokenIdToRead && shouldRead ? [BigInt(tokenIdToRead)] as const : undefined,
    chainId: CONTRACT_CHAIN_ID,
    query: {
      enabled: shouldRead && !!tokenIdToRead,
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Token ID (Agent ID)
        </label>
        <input
          type="number"
          value={tokenIdToRead}
          onChange={(e) => {
            setTokenIdToRead(e.target.value);
            setShouldRead(false);
          }}
          placeholder="0"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Enter the Token ID to query
        </p>
      </div>

      {/* Contract Info */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <span className="font-medium">Contract:</span> {CONTRACT_ADDRESS}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          <span className="font-medium">Network:</span> KiteAI Testnet (Chain ID: {CONTRACT_CHAIN_ID})
        </p>
      </div>

      <button
        onClick={() => {
          console.log('🔍 Query tokenURI, Token ID:', tokenIdToRead);
          setShouldRead(true);
        }}
        disabled={!tokenIdToRead || isReading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isReading ? 'Querying...' : 'Query Token URI'}
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
            💡 Tip: Query fails if Token ID doesn&apos;t exist or is not registered
          </p>
        </div>
      )}

      {readTokenUri && shouldRead && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Token URI:
            </h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(readTokenUri as string);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Copy
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-3 break-all">
            <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">
              {readTokenUri as string}
            </p>
          </div>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          💡 Tip: Token ID must be a registered Agent ID
        </p>
      </div>
    </div>
  );
}

