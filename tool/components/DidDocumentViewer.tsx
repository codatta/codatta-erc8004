'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

export function DidDocumentViewer() {
  const [didId, setDidId] = useState('');
  const [didDocument, setDidDocument] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    if (didDocument) {
      const code = JSON.stringify(didDocument, null, 2);
      const highlighted = Prism.highlight(code, Prism.languages.json, 'json');
      setHighlightedCode(highlighted);
    }
  }, [didDocument]);

  const handleFetchDid = async () => {
    if (!didId.trim()) {
      setError('Please enter a DID');
      return;
    }

    setLoading(true);
    setError(null);
    setDidDocument(null);

    try {
      // Example: Fetch from a DID resolver service
      // You should replace this URL with your actual DID service endpoint
      const serviceUrl = process.env.NEXT_PUBLIC_DID_SERVICE_URL || 'https://dev.uniresolver.io/1.0/identifiers';
      const response = await axios.get(`${serviceUrl}/${encodeURIComponent(didId)}`);
      
      setDidDocument(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('DID not found');
      } else {
        setError(err.message || 'Failed to fetch DID document');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          DID Identifier
        </label>
        <input
          type="text"
          value={didId}
          onChange={(e) => setDidId(e.target.value)}
          placeholder="did:example:123456789abcdefghi"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
          onKeyDown={(e) => e.key === 'Enter' && handleFetchDid()}
        />
      </div>

      <button
        onClick={handleFetchDid}
        disabled={loading}
        className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        {loading ? 'Fetching...' : 'Fetch DID'}
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {didDocument && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              DID Document:
            </h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(didDocument, null, 2));
              }}
              className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
            >
              Copy
            </button>
          </div>
          <pre className="language-json">
            <code
              className="language-json"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-700 dark:text-blue-400">
          💡 Configure the DID service URL in your .env file (NEXT_PUBLIC_DID_SERVICE_URL)
        </p>
      </div>
    </div>
  );
}

