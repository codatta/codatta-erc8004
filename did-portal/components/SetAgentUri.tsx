'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { didToAgentId } from '@/lib/uuid-helper';

export function SetAgentUri() {
  const [didInput, setDidInput] = useState('');
  const [tokenUri, setTokenUri] = useState('');
  const [txHash, setTxHash] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { writeContractAsync, isPending, error: contractError } = useWriteContract();

  const handleSetAgentUri = async () => {
    if (!didInput.trim() || !tokenUri.trim()) return;

    try {
      setError(null);
      setTxHash('');
      setSuccessMessage('');

      const agentId = didToAgentId(didInput);

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'setAgentUri',
        args: [agentId, tokenUri] as const,
        chainId: CONTRACT_CHAIN_ID,
      });

      setTxHash(hash);
      setSuccessMessage('✅ Token URI set successfully!');
      
      // Clear inputs after success
      setTimeout(() => {
        setDidInput('');
        setTokenUri('');
        setTxHash('');
        setSuccessMessage('');
      }, 3000);
    } catch (err: any) {
      console.error('Error setting agent URI:', err);
      setError(err.message || 'Failed to set Token URI');
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
          onChange={(e) => setDidInput(e.target.value)}
          placeholder="did:codatta:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          The agent DID to set token URI for
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Token URI
        </label>
        <input
          type="text"
          value={tokenUri}
          onChange={(e) => setTokenUri(e.target.value)}
          placeholder="https://example.com/metadata.json"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          URL pointing to agent metadata JSON
        </p>
      </div>

      <button
        onClick={handleSetAgentUri}
        disabled={!didInput.trim() || !tokenUri.trim() || isPending}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isPending ? 'Setting Token URI...' : 'Set Token URI'}
      </button>

      {(error || contractError) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
            ❌ Error
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 break-all">
            {error || contractError?.message}
          </p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
            {successMessage}
          </p>
          {txHash && (
            <p className="text-xs text-gray-600 dark:text-gray-400 break-all">
              <span className="font-medium">TX Hash:</span> {txHash}
            </p>
          )}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          💡 Note: You must be the owner or approved to set token URI for this agent
        </p>
      </div>
    </div>
  );
}

