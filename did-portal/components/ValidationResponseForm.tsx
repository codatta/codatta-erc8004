'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { VALIDATION_CONTRACT_ADDRESS, VALIDATION_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { keccak256, toHex, padHex, stringToHex, type Hex } from 'viem';
import { kiteAITestnet } from '@/lib/wagmi';

export function ValidationResponseForm() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const [requestHash, setRequestHash] = useState('');
  const [response, setResponse] = useState('');
  const [responseUri, setResponseUri] = useState('');
  const [tag, setTag] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    data: txHash,
    error: writeError,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  useEffect(() => {
    if (writeError) {
      setFormError(writeError.message);
    } else {
      setFormError(null);
    }
  }, [writeError]);

  useEffect(() => {
    if (isConfirmed) {
      setFormError(null);
    }
  }, [isConfirmed]);

  const handleSubmit = async () => {
    if (!isConnected) {
      setFormError('Please connect your wallet.');
      return;
    }
    if (chainId !== CONTRACT_CHAIN_ID) {
      setFormError(`Please switch to ${kiteAITestnet.name} (Chain ID: ${CONTRACT_CHAIN_ID}).`);
      switchChain({ chainId: CONTRACT_CHAIN_ID });
      return;
    }

    const responseNum = parseInt(response);
    if (isNaN(responseNum) || responseNum < 0 || responseNum > 100) {
      setFormError('Response must be between 0 and 100.');
      return;
    }
    if (!requestHash) {
      setFormError('Request Hash is required.');
      return;
    }
    if (!responseUri) {
      setFormError('Response URI is required.');
      return;
    }

    setFormError(null);

    try {
      // Generate responseHash from responseUri
      const responseHash = keccak256(toHex(responseUri));
      
      // Convert tag to bytes32 (optional)
      const tagBytes = tag ? padHex(stringToHex(tag), { size: 32 }) : padHex('0x', { size: 32 });

      writeContract({
        address: VALIDATION_CONTRACT_ADDRESS as `0x${string}`,
        abi: VALIDATION_ABI,
        functionName: 'validationResponse',
        args: [
          requestHash as Hex,
          responseNum,
          responseUri,
          responseHash,
          tagBytes,
        ],
        chainId: CONTRACT_CHAIN_ID,
      });
    } catch (err: any) {
      console.error('Error submitting validation response:', err);
      setFormError(err.message || 'Failed to submit validation response.');
    }
  };

  const handleClear = () => {
    setRequestHash('');
    setResponse('');
    setResponseUri('');
    setTag('');
    setFormError(null);
  };

  const isButtonDisabled = isWritePending || isConfirming || !isConnected || !requestHash || !response || !responseUri || chainId !== CONTRACT_CHAIN_ID;

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-700 dark:text-yellow-400">
            Please connect your wallet first
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Request Hash *
              </label>
              <input
                type="text"
                value={requestHash}
                onChange={(e) => setRequestHash(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Response (0-100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="0-100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Response URI *
              </label>
              <input
                type="text"
                value={responseUri}
                onChange={(e) => setResponseUri(e.target.value)}
                placeholder="ipfs://... or https://..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag (Optional)
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g., security"
                maxLength={31}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400 break-all">{formError}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className="w-full px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWritePending ? '📝 Confirming...' :
             isConfirming ? '⏳ Processing...' :
             'Submit Validation Response'}
          </button>

          {isConfirmed && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-600 dark:text-green-400">
                Validation response submitted! Transaction hash: {txHash}
              </p>
            </div>
          )}

          <button
            onClick={handleClear}
            className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
}

