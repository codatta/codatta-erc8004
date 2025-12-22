'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

export function AgentDocumentViewer() {
  const [didId, setDidId] = useState('');
  const [agentDocument, setAgentDocument] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedCode, setHighlightedCode] = useState('');

  useEffect(() => {
    if (agentDocument) {
      const code = JSON.stringify(agentDocument, null, 2);
      const highlighted = Prism.highlight(code, Prism.languages.json, 'json');
      setHighlightedCode(highlighted);
    }
  }, [agentDocument]);

  const handleFetchAgent = async () => {
    if (!didId.trim()) {
      setError('Please enter a DID');
      return;
    }

    setLoading(true);
    setError(null);
    setAgentDocument(null);

    try {
      // Fetch directly from agent base URL
      const agentBaseUrl = process.env.NEXT_PUBLIC_AGENT_BASE_URL || 'https://omniverselab.s3.us-west-2.amazonaws.com/agent';
      const url = `${agentBaseUrl}/${encodeURIComponent(didId)}.json`;
      
      console.log('Fetching agent document from:', url);
      
      const response = await axios.get(url);
      
      // Direct response is the agent document
      setAgentDocument(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError('Agent document not found');
      } else if (err.response?.status === 403) {
        setError('Access denied to agent document');
      } else {
        setError(err.message || 'Failed to fetch Agent document');
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
          placeholder="did:codatta:..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          onKeyPress={(e) => e.key === 'Enter' && handleFetchAgent()}
        />
      </div>

      <button
        onClick={handleFetchAgent}
        disabled={loading}
        className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
      >
        {loading ? 'Loading...' : 'Query Agent Document'}
      </button>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {agentDocument && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Agent Document:
            </h4>
            <button
              onClick={() => {
                const text = JSON.stringify(agentDocument, null, 2);
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
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
            <code
              className="language-json"
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
            />
          </pre>
        </div>
      )}
    </div>
  );
}

