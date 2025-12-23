'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi';
import { VALIDATION_CONTRACT_ADDRESS, VALIDATION_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { keccak256, toHex, isAddress } from 'viem';
import { didToAgentId } from '@/lib/uuid-helper';
import { kiteAITestnet } from '@/lib/wagmi';

export function ValidationRequestForm() {
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();

  const [validatorAddress, setValidatorAddress] = useState('');
  const [didInput, setDidInput] = useState('');
  const [requestUri, setRequestUri] = useState('');
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

    if (!validatorAddress || !isAddress(validatorAddress)) {
      setFormError('Invalid validator address.');
      return;
    }
    if (!didInput.trim()) {
      setFormError('Agent DID is required.');
      return;
    }
    if (!requestUri) {
      setFormError('Request URI is required.');
      return;
    }

    setFormError(null);

    try {
      const agentId = didToAgentId(didInput);
      // Generate requestHash from requestUri
      const requestHash = keccak256(toHex(requestUri));

      writeContract({
        address: VALIDATION_CONTRACT_ADDRESS as `0x${string}`,
        abi: VALIDATION_ABI,
        functionName: 'validationRequest',
        args: [
          validatorAddress as `0x${string}`,
          agentId,
          requestUri,
          requestHash,
        ],
        chainId: CONTRACT_CHAIN_ID,
      });
    } catch (err: any) {
      console.error('Error submitting validation request:', err);
      setFormError(err.message || 'Failed to submit validation request.');
    }
  };

  const handleClear = () => {
    setValidatorAddress('');
    setDidInput('');
    setRequestUri('');
    setFormError(null);
  };

  const isButtonDisabled = isWritePending || isConfirming || !isConnected || !validatorAddress || !didInput.trim() || !requestUri || chainId !== CONTRACT_CHAIN_ID;

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
                Validator Address *
              </label>
              <input
                type="text"
                value={validatorAddress}
                onChange={(e) => setValidatorAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Agent DID *
              </label>
              <input
                type="text"
                value={didInput}
                onChange={(e) => setDidInput(e.target.value)}
                placeholder="did:codatta:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Request URI *
              </label>
              <input
                type="text"
                value={requestUri}
                onChange={(e) => setRequestUri(e.target.value)}
                placeholder="ipfs://... or https://..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWritePending ? '📝 Confirming...' :
             isConfirming ? '⏳ Processing...' :
             'Submit Validation Request'}
          </button>

          {isConfirmed && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-600 dark:text-green-400">
                Validation request submitted! Transaction hash: {txHash}
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

