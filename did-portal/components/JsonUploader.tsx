'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { parseCodattaDID } from '@/lib/did-validator';

export function JsonUploader() {
  // DID document state
  const [didFile, setDidFile] = useState<File | null>(null);
  const [didContent, setDidContent] = useState<any>(null);
  const [didId, setDidId] = useState<string>('');
  
  // Agent document state
  const [agentFile, setAgentFile] = useState<File | null>(null);
  const [agentContent, setAgentContent] = useState<any>(null);
  const [agentName, setAgentName] = useState<string>('');
  
  // Common state
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle DID document drop
  const onDidDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setDidFile(selectedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setDidContent(json);
          
          if (!json.id) {
            setError('DID document missing "id" field');
            console.warn('⚠️ No id field found in DID document');
          } else if (typeof json.id !== 'string') {
            setError('The "id" field in DID document must be a string');
            console.warn('⚠️ Incorrect id field type:', typeof json.id);
          } else {
            const validationResult = parseCodattaDID(json.id);
            
            if (validationResult.valid) {
              setDidId(json.id);
              console.log('✅ Valid DID read from DID document:', json.id);
            } else {
              setError(`Invalid DID format in DID document: ${validationResult.error}`);
              console.error('❌ Invalid DID format:', json.id);
            }
          }
        } catch (err) {
          setError('Invalid JSON file for DID document');
          setDidFile(null);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setError('Please select a valid JSON file for DID document');
    }
  }, []);

  // Handle Agent document drop
  const onAgentDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setAgentFile(selectedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setAgentContent(json);
          
          if (!json.name) {
            setError('Agent document missing "name" field');
            console.warn('⚠️ No name field found in Agent document');
          } else if (typeof json.name !== 'string') {
            setError('The "name" field in Agent document must be a string');
            console.warn('⚠️ Incorrect name field type:', typeof json.name);
          } else {
            const validationResult = parseCodattaDID(json.name);
            
            if (validationResult.valid) {
              setAgentName(json.name);
              console.log('✅ Valid DID read from Agent document:', json.name);
            } else {
              setError(`Invalid DID format in Agent document "name" field: ${validationResult.error}`);
              console.error('❌ Invalid DID format in agent name:', json.name);
            }
          }
        } catch (err) {
          setError('Invalid JSON file for Agent document');
          setAgentFile(null);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setError('Please select a valid JSON file for Agent document');
    }
  }, []);

  const didDropzone = useDropzone({
    onDrop: onDidDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const agentDropzone = useDropzone({
    onDrop: onAgentDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const handleUpload = async () => {
    // Validation
    if (!didFile || !didContent) {
      setError('Please upload DID document');
      return;
    }
    
    if (!agentFile || !agentContent) {
      setError('Please upload Agent document');
      return;
    }
    
    if (!didId.trim()) {
      setError('"id" field not found in DID document');
      return;
    }
    
    if (!agentName.trim()) {
      setError('"name" field not found in Agent document');
      return;
    }

    // Validate DID formats
    const didValidation = parseCodattaDID(didId);
    const agentValidation = parseCodattaDID(agentName);
    
    if (!didValidation.valid) {
      setError(`Invalid DID in DID document: ${didValidation.error}`);
      return;
    }
    
    if (!agentValidation.valid) {
      setError(`Invalid DID in Agent document: ${agentValidation.error}`);
      return;
    }

    // Check if DIDs match
    if (didId !== agentName) {
      setError(`DID mismatch: DID document id "${didId}" does not match Agent document name "${agentName}"`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const updaterUrl = process.env.NEXT_PUBLIC_UPDATER_URL || 'http://localhost:3001';
      
      // Upload DID document
      console.log('📤 Uploading DID document:', {
        url: `${updaterUrl}/document/${encodeURIComponent(didId)}`,
        did: didId,
      });
      
      const didResponse = await axios.put(
        `${updaterUrl}/document/${encodeURIComponent(didId)}`,
        didContent,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      console.log('✅ DID document uploaded:', didResponse.data);
      
      // Upload Agent document (using /agent endpoint)
      console.log('📤 Uploading Agent document:', {
        url: `${updaterUrl}/agent/${encodeURIComponent(agentName)}`,
        did: agentName,
      });
      
      const agentResponse = await axios.put(
        `${updaterUrl}/agent/${encodeURIComponent(agentName)}`,
        agentContent,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      
      console.log('✅ Agent document uploaded:', agentResponse.data);
      
      setUploadResult(`Upload successful! 
        DID: ${JSON.stringify(didResponse.data)} 
        Agent: ${JSON.stringify(agentResponse.data)}`);
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setDidFile(null);
    setDidContent(null);
    setDidId('');
    setAgentFile(null);
    setAgentContent(null);
    setAgentName('');
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* DID Document Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          1. DID Document (did.json)
        </label>
        <div
          {...didDropzone.getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            didDropzone.isDragActive
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <input {...didDropzone.getInputProps()} />
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3"
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
            {didFile ? (
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ {didFile.name}
                </p>
                {didId && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    DID: {didId}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {didDropzone.isDragActive
                    ? 'Drop DID document here'
                    : 'Drag & drop DID document or click to browse'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  JSON file with &quot;id&quot; field
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Agent Document Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          2. Agent Document (agent.json)
        </label>
        <div
          {...agentDropzone.getRootProps()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            agentDropzone.isDragActive
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500'
          }`}
        >
          <input {...agentDropzone.getInputProps()} />
          <div className="flex flex-col items-center">
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3"
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
            {agentFile ? (
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  ✓ {agentFile.name}
                </p>
                {agentName && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                    DID: {agentName}
                  </p>
                )}
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {agentDropzone.isDragActive
                    ? 'Drop Agent document here'
                    : 'Drag & drop Agent document or click to browse'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  JSON file with &quot;name&quot; field (must match DID document id)
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DID Match Status */}
      {didId && agentName && (
        <div className={`rounded-lg p-3 ${
          didId === agentName
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}>
          <p className={`text-sm ${
            didId === agentName
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {didId === agentName
              ? '✓ DID fields match'
              : '✗ DID fields do not match'}
          </p>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!didFile || !agentFile || uploading || didId !== agentName}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
      >
        {uploading ? 'Uploading...' : 'Upload Both Documents'}
      </button>

      {/* Clear Button */}
      {(didFile || agentFile) && (
        <button
          onClick={handleClear}
          disabled={uploading}
          className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
        >
          Clear All
        </button>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">{uploadResult}</p>
        </div>
      )}
    </div>
  );
}
