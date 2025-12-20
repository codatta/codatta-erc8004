'use client';

import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { CONTRACT_ADDRESS, CONTRACT_CHAIN_ID } from '@/lib/contract-config';
import { JsonUploader } from '@/components/JsonUploader';
import { ContractInteraction } from '@/components/ContractInteraction';
import { DidDocumentViewer } from '@/components/DidDocumentViewer';
import { AgentDocumentViewer } from '@/components/AgentDocumentViewer';
import { TokenUriQuery } from '@/components/TokenUriQuery';
import { SetMetadata } from '@/components/SetMetadata';
import { MetadataQuery } from '@/components/MetadataQuery';
import { FeedbackGiverWithAuth } from '@/components/FeedbackGiverWithAuth';
import { ScoreQuery } from '@/components/ScoreQuery';
import { ValidationRequestForm } from '@/components/ValidationRequestForm';
import { ValidationResponseForm } from '@/components/ValidationResponseForm';
import { ValidationQueries } from '@/components/ValidationQueries';

type TabType = 'identity' | 'reputation' | 'validation';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('identity');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Codatta Tool
          </h1>
          <ConnectButton />
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('identity')}
              className={`py-4 px-2 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === 'identity'
                  ? 'text-green-600 dark:text-green-400 border-green-600 dark:border-green-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Identity System
            </button>
            <button
              onClick={() => setActiveTab('reputation')}
              className={`py-4 px-2 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === 'reputation'
                  ? 'text-purple-600 dark:text-purple-400 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Reputation System
            </button>
            <button
              onClick={() => setActiveTab('validation')}
              className={`py-4 px-2 font-semibold text-sm transition-colors border-b-2 ${
                activeTab === 'validation'
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Validation System
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Identity System Tab Content */}
        {activeTab === 'identity' && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {/* Left: Contract Interaction & Metadata */}
            <div>
              <div className="bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Identity Management
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Register agents, set metadata
                </p>
              </div>

              {/* Contract Info (Display Once) */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Contract:</span> {CONTRACT_ADDRESS}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span className="font-medium">Network:</span> KiteAI Testnet (Chain ID: {CONTRACT_CHAIN_ID})
                </p>
              </div>

              <div className="space-y-6">
                {/* Register Agent */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Register Agent
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Register new agent identity
                  </p>
                  <ContractInteraction />
                </div>

                {/* Set Metadata */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Set Metadata
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Set document URL metadata
                  </p>
                  <SetMetadata />
                </div>
              </div>
            </div>

            {/* Middle: Upload Documents */}
            <div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Upload Documents
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Upload DID and Agent documents
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Upload Documents
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Upload DID and Agent JSON files
                </p>
                <JsonUploader />
              </div>
            </div>

            {/* Right: Query Functions */}
            <div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 border border-purple-200 dark:border-purple-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Query Functions
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Query documents and metadata
                </p>
              </div>

              <div className="space-y-6">
                {/* Query DID Document */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Query DID Document
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Fetch DID document
                  </p>
                  <DidDocumentViewer />
                </div>

                {/* Query Agent Document */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Query Agent Document
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Fetch Agent document
                  </p>
                  <AgentDocumentViewer />
                </div>

                {/* Query Token URI */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Query Token URI
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Query on-chain token URI
                  </p>
                  <TokenUriQuery />
                </div>

                {/* Query Metadata */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Query Metadata
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Query metadata document URL
                  </p>
                  <MetadataQuery />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reputation System Tab Content */}
        {activeTab === 'reputation' && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Left: Give Feedback */}
            <div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 border border-purple-200 dark:border-purple-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Reputation Interaction
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Submit feedback and ratings for agents
                </p>
              </div>

              {/* Give Feedback */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Give Feedback
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Submit feedback and rating for an agent
                </p>
                <FeedbackGiverWithAuth />
              </div>
            </div>

            {/* Right: Query Score */}
            <div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 mb-6 border border-orange-200 dark:border-orange-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Reputation Queries
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Query agent reputation scores
                </p>
              </div>

              {/* Query Agent Score */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Query Agent Score
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Query reputation score for an agent
                </p>
                <ScoreQuery />
              </div>
            </div>
          </div>
        )}

        {/* Validation System Tab Content */}
        {activeTab === 'validation' && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Left: Validation Request & Response */}
            <div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Validation Interaction
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Submit validation requests and responses
                </p>
              </div>

              <div className="space-y-6">
                {/* Validation Request */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Validation Request
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Submit a validation request to a validator
                  </p>
                  <ValidationRequestForm />
                </div>

                {/* Validation Response */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Validation Response
                    </h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                    Respond to a validation request
                  </p>
                  <ValidationResponseForm />
                </div>
              </div>
            </div>

            {/* Right: Validation Queries */}
            <div>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 mb-6 border border-orange-200 dark:border-orange-800">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Validation Queries
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Query validation data from blockchain
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Query Validations
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                  Query validation status, summaries, and more
                </p>
                <ValidationQueries />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Codatta Tool © 2025</p>
        </div>
      </footer>
    </div>
  );
}

