'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { JsonUploader } from '@/components/JsonUploader';
import { ContractInteraction } from '@/components/ContractInteraction';
import { DidDocumentViewer } from '@/components/DidDocumentViewer';
import { TokenUriQuery } from '@/components/TokenUriQuery';

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
          {/* Left: Register Agent */}
          <div>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-6 border border-purple-200 dark:border-purple-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Register Agent
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Register agent and set token URI
              </p>
            </div>

            <ContractInteraction />
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

