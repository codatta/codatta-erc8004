'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { parseCodattaDID } from '@/lib/did-validator';

export function JsonUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [jsonContent, setJsonContent] = useState<any>(null);
  const [documentId, setDocumentId] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setError(null);
      
      // Read and parse JSON file
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          setJsonContent(json);
          
          // Automatically extract id field as DID from JSON
          if (!json.id) {
            setError('Missing "id" field in JSON file');
            console.warn('⚠️ No id field found in JSON file');
          } else if (typeof json.id !== 'string') {
            setError('The "id" field in JSON must be a string');
            console.warn('⚠️ Incorrect id field type:', typeof json.id);
          } else {
            // Validate DID format
            const validationResult = parseCodattaDID(json.id);
            
            if (validationResult.valid) {
              setDocumentId(json.id);
              console.log('✅ Valid DID read from file:', json.id);
              console.log('   - Method:', validationResult.method);
              console.log('   - UUID:', validationResult.uuid);
            } else {
              setError(`Invalid DID format: ${validationResult.error}`);
              console.error('❌ Invalid DID format:', json.id);
              console.error('   - Error:', validationResult.error);
            }
          }
        } catch (err) {
          setError('Invalid JSON file');
          setFile(null);
        }
      };
      reader.readAsText(selectedFile);
    } else {
      setError('Please select a valid JSON file');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file || !jsonContent) return;
    
    if (!documentId.trim()) {
      setError('"id" field not found in JSON file, cannot upload');
      return;
    }

    // Validate DID format again before upload
    const validationResult = parseCodattaDID(documentId);
    if (!validationResult.valid) {
      setError(`Cannot upload: ${validationResult.error}`);
      return;
    }

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      // Build URL: /document/:id
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || '/api';
      const url = `${baseUrl}/document/${encodeURIComponent(documentId)}`;
      
      console.log('📤 Uploading document:', {
        url,
        documentId,
        method: 'PUT',
        didValid: validationResult.valid,
        uuid: validationResult.uuid,
      });

      const response = await axios.put(url, jsonContent, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      setUploadResult('Upload successful! ' + JSON.stringify(response.data));
      console.log('✅ Upload successful:', response.data);
    } catch (err: any) {
      console.error('❌ Upload failed:', err);
      setError(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setJsonContent(null);
    setDocumentId('');
    setUploadResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {isDragActive ? (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drop the JSON file here...
          </p>
        ) : (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Drag and drop a JSON file, or click to select
          </p>
        )}
      </div>

      {file && (
        <>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {file.name}
              </span>
              <button
                onClick={handleClear}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Clear
              </button>
            </div>
            <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-auto max-h-40 bg-white dark:bg-gray-800 p-2 rounded">
              {JSON.stringify(jsonContent, null, 2)}
            </pre>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Document ID (Read from file)
            </label>
            {documentId ? (
              <div className="border border-green-300 dark:border-green-600 rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">
                      ✓ Document ID Identified
                    </p>
                    <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                      {documentId}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-600 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-sm">
                ⏳ Waiting to read id field from JSON file...
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>💡 DID will be automatically extracted from the "id" field in the JSON file</p>
              <p className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                Format: did:codatta:&lt;UUID-v4&gt;
              </p>
              <p className="text-gray-400 dark:text-gray-500">
                UUID-v4 example: 12345678-abcd-4def-9012-3456789abcde
              </p>
            </div>
          </div>
        </>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {uploadResult && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-sm text-green-600 dark:text-green-400">{uploadResult}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || !documentId.trim() || uploading}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {uploading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Document (PUT)
          </>
        )}
      </button>
    </div>
  );
}

