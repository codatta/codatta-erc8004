'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { REPUTATION_CONTRACT_ADDRESS, REPUTATION_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { stringToHex, padHex } from 'viem';
import { useFeedbackAuth } from '@/lib/use-feedback-auth';
import { generateFeedbackHash } from '@/lib/feedback-auth';

export function FeedbackGiverWithAuth() {
  const { address, isConnected } = useAccount();
  const [agentId, setAgentId] = useState('');
  const [score, setScore] = useState('');
  const [tag1, setTag1] = useState('');
  const [tag2, setTag2] = useState('');
  const [feedbackUri, setFeedbackUri] = useState('');
  
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const { requestAuth, loading: authLoading, error: authError } = useFeedbackAuth();

  const handleGiveFeedback = async () => {
    if (!agentId || !score) {
      alert('Please enter Agent ID and Score');
      return;
    }

    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    const scoreNum = parseInt(score);
    if (scoreNum < 0 || scoreNum > 100) {
      alert('Score must be between 0 and 100');
      return;
    }

    try {
      const emptyBytes32 = '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`;
      const tag1Bytes = tag1 ? padHex(stringToHex(tag1), { size: 32 }) : emptyBytes32;
      const tag2Bytes = tag2 ? padHex(stringToHex(tag2), { size: 32 }) : emptyBytes32;
      
      // 1. 请求授权签名
      console.log('📝 Requesting feedbackAuth...');
      const feedbackAuth = await requestAuth({
        agentId,
        clientAddress: address,
        indexLimit: 10,
        expiryDays: 30,
      });

      if (!feedbackAuth) {
        throw new Error('Failed to obtain authorization signature');
      }

      // 2. 生成 feedbackHash
      const feedbackHash = generateFeedbackHash(
        feedbackUri || '',
        scoreNum,
        tag1Bytes,
        tag2Bytes
      );

      console.log('🚀 Submitting feedback with:', {
        agentId,
        score: scoreNum,
        feedbackAuthLength: feedbackAuth.length,
        feedbackHashLength: feedbackHash.length,
      });

      // 3. 调用合约
      writeContract({
        address: REPUTATION_CONTRACT_ADDRESS as `0x${string}`,
        abi: REPUTATION_ABI,
        functionName: 'giveFeedback',
        args: [
          BigInt(agentId),
          scoreNum,
          tag1Bytes,
          tag2Bytes,
          feedbackUri || '',
          feedbackHash,
          feedbackAuth,
        ],
        chainId: CONTRACT_CHAIN_ID,
      });

    } catch (err: any) {
      console.error('Error giving feedback:', err);
      alert(`Error: ${err.message}`);
    }
  };

  const handleClear = () => {
    setAgentId('');
    setScore('');
    setTag1('');
    setTag2('');
    setFeedbackUri('');
  };

  const isProcessing = authLoading || isPending || isConfirming;

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
                Agent ID *
              </label>
              <input
                type="number"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                placeholder="Enter Agent ID"
                disabled={isProcessing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Score (0-100) *
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                placeholder="0-100"
                disabled={isProcessing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag 1 (Optional)
              </label>
              <input
                type="text"
                value={tag1}
                onChange={(e) => setTag1(e.target.value)}
                placeholder="e.g., quality"
                maxLength={31}
                disabled={isProcessing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag 2 (Optional)
              </label>
              <input
                type="text"
                value={tag2}
                onChange={(e) => setTag2(e.target.value)}
                placeholder="e.g., speed"
                maxLength={31}
                disabled={isProcessing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Feedback URI (Optional)
              </label>
              <input
                type="text"
                value={feedbackUri}
                onChange={(e) => setFeedbackUri(e.target.value)}
                placeholder="https://..."
                disabled={isProcessing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
              />
            </div>
          </div>

          <button
            onClick={handleGiveFeedback}
            disabled={!agentId || !score || isProcessing}
            className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {authLoading ? '🔐 Requesting Authorization...' : 
             isPending ? '📝 Confirming...' : 
             isConfirming ? '⏳ Processing...' : 
             'Give Feedback'}
          </button>

          {(agentId || score || tag1 || tag2 || feedbackUri) && (
            <button
              onClick={handleClear}
              disabled={isProcessing}
              className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          )}

          {authError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                Authorization Error:
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                {authError}
              </p>
            </div>
          )}

          {hash && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <p className="text-sm text-blue-700 dark:text-blue-400 break-all">
                Transaction Hash: {hash}
              </p>
            </div>
          )}

          {isSuccess && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-sm text-green-700 dark:text-green-400">
                ✓ Feedback submitted successfully!
              </p>
            </div>
          )}

          {writeError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                Contract Error:
              </p>
              <p className="text-sm text-red-600 dark:text-red-400">
                {writeError.message}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

