'use client';

import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { VALIDATION_CONTRACT_ADDRESS, VALIDATION_ABI } from '@/lib/contract-config';
import { didToAgentId } from '@/lib/uuid-helper';
import { isAddress, type Hex } from 'viem';

export function ValidationQueries() {
  const [activeTab, setActiveTab] = useState<'status' | 'summary' | 'agent' | 'validator'>('status');

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'status'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Status
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'summary'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'agent'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Agent
        </button>
        <button
          onClick={() => setActiveTab('validator')}
          className={`px-4 py-2 font-medium text-sm transition-colors ${
            activeTab === 'validator'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Validator
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === 'status' && <ValidationStatusQuery />}
        {activeTab === 'summary' && <SummaryQuery />}
        {activeTab === 'agent' && <AgentValidationsQuery />}
        {activeTab === 'validator' && <ValidatorRequestsQuery />}
      </div>
    </div>
  );
}

// Get Validation Status
function ValidationStatusQuery() {
  const [requestHash, setRequestHash] = useState('');
  const [shouldRead, setShouldRead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, error: readError, isFetching } = useReadContract({
    address: VALIDATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: VALIDATION_ABI,
    functionName: 'getValidationStatus',
    args: requestHash ? [requestHash as Hex] : undefined,
    query: {
      enabled: shouldRead && requestHash.length > 0,
    },
  });

  const handleQuery = () => {
    if (!requestHash.trim()) {
      setError('Please enter a Request Hash');
      return;
    }
    setShouldRead(true);
    setError(null);
  };

  const handleClear = () => {
    setRequestHash('');
    setShouldRead(false);
    setError(null);
  };

  const result = data as [string, bigint, number, string, string, bigint] | undefined;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Request Hash
        </label>
        <input
          type="text"
          value={requestHash}
          onChange={(e) => {
            setRequestHash(e.target.value);
            setShouldRead(false);
          }}
          placeholder="0x..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleQuery}
          disabled={isFetching || !requestHash}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetching ? 'Querying...' : 'Query Status'}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {(error || readError) && shouldRead && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 break-all">
            {error || readError?.message}
          </p>
        </div>
      )}

      {result && shouldRead && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Validation Status:
          </h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Validator:</span> <span className="font-mono">{result[0]}</span></p>
            <p><span className="font-medium">Agent ID:</span> {result[1].toString()}</p>
            <p><span className="font-medium">Response:</span> {result[2]}</p>
            <p><span className="font-medium">Response Hash:</span> <span className="font-mono text-xs">{result[3]}</span></p>
            <p><span className="font-medium">Tag:</span> <span className="font-mono text-xs">{result[4]}</span></p>
            <p><span className="font-medium">Last Update:</span> {new Date(Number(result[5]) * 1000).toLocaleString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Get Summary
function SummaryQuery() {
  const [didInput, setDidInput] = useState('');
  const [validatorAddresses, setValidatorAddresses] = useState('');
  const [tag, setTag] = useState('');
  const [shouldRead, setShouldRead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agentId = didInput ? didToAgentId(didInput) : undefined;

  const { data, error: readError, isFetching } = useReadContract({
    address: VALIDATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: VALIDATION_ABI,
    functionName: 'getSummary',
    args: agentId ? [
      agentId,
      validatorAddresses ? validatorAddresses.split(',').map(a => a.trim() as `0x${string}`) : [],
      tag ? tag as Hex : '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex,
    ] : undefined,
    query: {
      enabled: shouldRead && agentId !== undefined,
    },
  });

  const handleQuery = () => {
    if (!didInput.trim()) {
      setError('Please enter an Agent DID');
      return;
    }
    if (!agentId) {
      setError('Invalid Agent DID format');
      return;
    }
    setShouldRead(true);
    setError(null);
  };

  const handleClear = () => {
    setDidInput('');
    setValidatorAddresses('');
    setTag('');
    setShouldRead(false);
    setError(null);
  };

  const result = data as [bigint, number] | undefined;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Agent DID *
        </label>
        <input
          type="text"
          value={didInput}
          onChange={(e) => {
            setDidInput(e.target.value);
            setShouldRead(false);
            setError(null);
          }}
          placeholder="did:codatta:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Validator Addresses (Optional, comma-separated)
        </label>
        <input
          type="text"
          value={validatorAddresses}
          onChange={(e) => {
            setValidatorAddresses(e.target.value);
            setShouldRead(false);
          }}
          placeholder="0x..., 0x..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Tag (Optional, bytes32 hex)
        </label>
        <input
          type="text"
          value={tag}
          onChange={(e) => {
            setTag(e.target.value);
            setShouldRead(false);
          }}
          placeholder="0x... (or leave empty)"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleQuery}
          disabled={isFetching || !didInput.trim() || !agentId}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetching ? 'Querying...' : 'Query Summary'}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {(error || readError) && shouldRead && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 break-all">
            {error || readError?.message}
          </p>
        </div>
      )}

      {result && shouldRead && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Summary:
          </h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Count:</span> {result[0].toString()}</p>
            <p><span className="font-medium">Average Response:</span> {result[1]}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Get Agent Validations
function AgentValidationsQuery() {
  const [didInput, setDidInput] = useState('');
  const [shouldRead, setShouldRead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agentId = didInput ? didToAgentId(didInput) : undefined;

  const { data, error: readError, isFetching } = useReadContract({
    address: VALIDATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: VALIDATION_ABI,
    functionName: 'getAgentValidations',
    args: agentId ? [agentId] : undefined,
    query: {
      enabled: shouldRead && agentId !== undefined,
    },
  });

  const handleQuery = () => {
    if (!didInput.trim()) {
      setError('Please enter an Agent DID');
      return;
    }
    if (!agentId) {
      setError('Invalid Agent DID format');
      return;
    }
    setShouldRead(true);
    setError(null);
  };

  const handleClear = () => {
    setDidInput('');
    setShouldRead(false);
    setError(null);
  };

  const requestHashes = data as Hex[] | undefined;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Agent DID
        </label>
        <input
          type="text"
          value={didInput}
          onChange={(e) => {
            setDidInput(e.target.value);
            setShouldRead(false);
            setError(null);
          }}
          placeholder="did:codatta:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleQuery}
          disabled={isFetching || !didInput.trim() || !agentId}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetching ? 'Querying...' : 'Query Validations'}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {(error || readError) && shouldRead && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 break-all">
            {error || readError?.message}
          </p>
        </div>
      )}

      {requestHashes && shouldRead && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Request Hashes ({requestHashes.length}):
          </h4>
          {requestHashes.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No validations found</p>
          ) : (
            <div className="space-y-1">
              {requestHashes.map((hash, idx) => (
                <p key={idx} className="text-xs font-mono break-all text-gray-700 dark:text-gray-300">
                  {idx + 1}. {hash}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Get Validator Requests
function ValidatorRequestsQuery() {
  const [validatorAddress, setValidatorAddress] = useState('');
  const [shouldRead, setShouldRead] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data, error: readError, isFetching } = useReadContract({
    address: VALIDATION_CONTRACT_ADDRESS as `0x${string}`,
    abi: VALIDATION_ABI,
    functionName: 'getValidatorRequests',
    args: validatorAddress && isAddress(validatorAddress) ? [validatorAddress as `0x${string}`] : undefined,
    query: {
      enabled: shouldRead && validatorAddress.length > 0 && isAddress(validatorAddress),
    },
  });

  const handleQuery = () => {
    if (!validatorAddress.trim()) {
      setError('Please enter a Validator Address');
      return;
    }
    if (!isAddress(validatorAddress)) {
      setError('Invalid validator address format');
      return;
    }
    setShouldRead(true);
    setError(null);
  };

  const handleClear = () => {
    setValidatorAddress('');
    setShouldRead(false);
    setError(null);
  };

  const requestHashes = data as Hex[] | undefined;

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Validator Address
        </label>
        <input
          type="text"
          value={validatorAddress}
          onChange={(e) => {
            setValidatorAddress(e.target.value);
            setShouldRead(false);
          }}
          placeholder="0x..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleQuery}
          disabled={isFetching || !validatorAddress}
          className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFetching ? 'Querying...' : 'Query Requests'}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Clear
        </button>
      </div>

      {(error || readError) && shouldRead && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400 break-all">
            {error || readError?.message}
          </p>
        </div>
      )}

      {requestHashes && shouldRead && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Request Hashes ({requestHashes.length}):
          </h4>
          {requestHashes.length === 0 ? (
            <p className="text-sm text-gray-600 dark:text-gray-400">No requests found</p>
          ) : (
            <div className="space-y-1">
              {requestHashes.map((hash, idx) => (
                <p key={idx} className="text-xs font-mono break-all text-gray-700 dark:text-gray-300">
                  {idx + 1}. {hash}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
