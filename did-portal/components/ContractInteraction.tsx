'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useChainId } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { formatAgentDID } from '@/lib/uuid-helper';
import { decodeEventLog } from 'viem';

export function ContractInteraction() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [error, setError] = useState<string | null>(null);
  
  // Registration result
  const [registeredAgentId, setRegisteredAgentId] = useState<bigint | null>(null);
  const [registeredDID, setRegisteredDID] = useState<string | null>(null);

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { 
    isLoading: isConfirming, 
    isSuccess: isConfirmed,
    data: receipt 
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Parse Registered event from transaction receipt
  useEffect(() => {
    if (receipt && isConfirmed) {
      console.log('📝 解析交易收据:', receipt);
      
      try {
        // Find Registered event in logs
        const registeredLog = receipt.logs.find((log) => {
          try {
            const decoded = decodeEventLog({
              abi: CONTRACT_ABI,
              data: log.data,
              topics: log.topics,
            });
            return decoded.eventName === 'Registered';
          } catch {
            return false;
          }
        });

        if (registeredLog) {
          const decoded = decodeEventLog({
            abi: CONTRACT_ABI,
            data: registeredLog.data,
            topics: registeredLog.topics,
          });

          console.log('✅ 捕获到 Registered 事件:', decoded);

          if (decoded.eventName === 'Registered' && decoded.args) {
            const agentId = decoded.args.agentId as bigint;
            setRegisteredAgentId(agentId);
            setRegisteredDID(formatAgentDID(agentId));
            console.log('🎉 Agent ID:', agentId.toString());
            console.log('🎉 DID:', formatAgentDID(agentId));
          }
        }
      } catch (err) {
        console.error('❌ 解析事件失败:', err);
      }
    }
  }, [receipt, isConfirmed]);

  const handleRegister = async () => {
    if (!isConnected) {
      setError('请先连接钱包');
      return;
    }

    try {
      setError(null);
      setRegisteredAgentId(null);
      setRegisteredDID(null);

      console.log('🚀 发起注册交易 (无参数):', {
        address: CONTRACT_ADDRESS,
        chainId: CONTRACT_CHAIN_ID,
        functionName: 'register',
        wallet: address,
        currentChainId: chainId,
      });

      await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'register',
        args: [],
        chainId: CONTRACT_CHAIN_ID,
      });

      console.log('✅ 注册交易已提交到钱包');
    } catch (err: any) {
      console.error('❌ 注册失败:', err);
      setError(err.message || '注册失败');
    }
  };

  // Check if user is on the correct network
  const isCorrectNetwork = chainId === CONTRACT_CHAIN_ID;

  return (
    <div className="space-y-6">
      {/* Wallet Connection Status */}
      {!isConnected ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-400">
            Please connect your wallet to interact with the contract
          </p>
        </div>
      ) : (
        <>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-700 dark:text-green-400">
              Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          
          {!isCorrectNetwork && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <p className="text-sm text-orange-700 dark:text-orange-400 font-medium">
                ⚠️ Please switch to KiteAI Testnet (Chain ID: {CONTRACT_CHAIN_ID})
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                Current Chain ID: {chainId}
              </p>
            </div>
          )}
        </>
      )}

      {/* Register Agent */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Register Agent
        </h3>

        <button
          onClick={handleRegister}
          disabled={!isConnected || !isCorrectNetwork || isPending || isConfirming || !!registeredAgentId}
          className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {!isCorrectNetwork && isConnected
            ? 'Switch to Correct Network'
            : isPending
            ? 'Waiting for Confirmation...'
            : isConfirming
            ? 'Confirming Transaction...'
            : registeredAgentId
            ? 'Registered ✓'
            : 'Register Agent'}
        </button>

        {/* Error Message */}
        {(error || writeError) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">
              {error || writeError?.message}
            </p>
          </div>
        )}

        {/* Registration Result */}
        {registeredAgentId && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 space-y-3">
            <p className="text-sm text-green-700 dark:text-green-400 font-medium">
              ✅ Agent Registered Successfully!
            </p>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Agent ID:</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                {registeredAgentId.toString()}
              </p>
            </div>
            
            {registeredDID && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-600 dark:text-gray-400">DID:</p>
                  <button
                    onClick={() => {
                      const text = registeredDID;
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
                    className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {registeredDID}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reset Button */}
      {registeredAgentId && (
        <button
          onClick={() => {
            setRegisteredAgentId(null);
            setRegisteredDID(null);
            setError(null);
          }}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          Start New Registration
        </button>
      )}

    </div>
  );
}
