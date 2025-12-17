'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { JsonUploader } from '@/components/JsonUploader';
import { ContractInteraction } from '@/components/ContractInteraction';
import { DidDocumentViewer } from '@/components/DidDocumentViewer';
import { AgentDocumentViewer } from '@/components/AgentDocumentViewer';
import { TokenUriQuery } from '@/components/TokenUriQuery';
import { FeedbackGiverWithAuth } from '@/components/FeedbackGiverWithAuth';
import { ScoreQuery } from '@/components/ScoreQuery';

export default function Home() {
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

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {/* Left: Register Agent & Give Feedback */}
          <div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 border border-purple-200 dark:border-purple-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Contract Interaction
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Register agent and manage reputation
              </p>
            </div>

            <div className="space-y-6">
              <ContractInteraction />

              {/* Give Feedback Section */}
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
          </div>

          {/* Middle: Upload DID Document */}
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Upload Document
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Upload DID document to backend
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
                  Upload DID Document
                </h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Upload JSON file with DID
              </p>
              <JsonUploader />
            </div>
          </div>

          {/* Right: Query Functions */}
          <div>
            <div className="bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 rounded-xl p-6 mb-6 border border-green-200 dark:border-green-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Query Functions
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Query on-chain and server data
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
                  Fetch DID document from server
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
                  Fetch Agent document from server
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
        </div>
      </main>

      <footer className="mt-16 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>Codatta Tool © 2025</p>
        </div>
      </footer>
    </div>
  );
}

