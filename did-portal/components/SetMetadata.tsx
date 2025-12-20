'use client';

import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { hexToString, stringToHex } from 'viem';

export function SetMetadata() {
  const [agentId, setAgentId] = useState('');
  const [metadataUrl, setMetadataUrl] = useState('');
  const [txHash, setTxHash] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { writeContractAsync, isPending, error } = useWriteContract();

  const handleSetMetadata = async () => {
    if (!agentId || !metadataUrl) return;

    try {
      setTxHash('');
      setSuccessMessage('');

      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'setMetadata',
        args: [BigInt(agentId), 'document', stringToHex(metadataUrl)] as const,
        chainId: CONTRACT_CHAIN_ID,
      });

      setTxHash(hash);
      setSuccessMessage('✅ Metadata set successfully!');
      
      // Clear inputs after success
      setTimeout(() => {
        setAgentId('');
        setMetadataUrl('');
        setTxHash('');
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error setting metadata:', err);
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
          onChange={(e) => setAgentId(e.target.value)}
          placeholder="Enter agent ID"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          The agent ID to set metadata for
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Document URL
        </label>
        <input
          type="text"
          value={metadataUrl}
          onChange={(e) => setMetadataUrl(e.target.value)}
          placeholder="https://example.com/document.json"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          URL for the document metadata (key: &quot;document&quot;)
        </p>
      </div>

      <button
        onClick={handleSetMetadata}
        disabled={!agentId || !metadataUrl || isPending}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {isPending ? 'Setting Metadata...' : 'Set Metadata'}
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-semibold mb-1">
            ❌ Error
          </p>
          <p className="text-xs text-red-600 dark:text-red-400 break-all">
            {error.message}
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
          💡 Note: You must be the owner or approved to set metadata for this agent
        </p>
      </div>
    </div>
  );
}

