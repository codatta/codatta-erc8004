/**
 * useFeedbackAuth Hook
 * 用于请求 feedbackAuth 签名
 */

import { useState } from 'react';

interface RequestAuthParams {
  agentId: string;
  clientAddress: `0x${string}`;
  indexLimit?: number;
  expiryDays?: number;
}

interface AuthResponse {
  success: boolean;
  feedbackAuth?: `0x${string}`;
  params?: {
    agentId: string;
    clientAddress: string;
    indexLimit: string;
    expiry: number;
    signerAddress: string;
  };
  error?: string;
}

export function useFeedbackAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestAuth = async (params: RequestAuthParams): Promise<`0x${string}` | null> => {
    setLoading(true);
    setError(null);

    try {
      // 从环境变量获取授权服务 URL
      const authServiceUrl = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3003';

      const response = await fetch(`${authServiceUrl}/api/request-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: params.agentId,
          clientAddress: params.clientAddress,
          indexLimit: params.indexLimit?.toString() || '10',
          expiryDays: params.expiryDays || 30,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AuthResponse = await response.json();

      if (!data.success || !data.feedbackAuth) {
        throw new Error(data.error || 'Failed to get authorization');
      }

      console.log('✅ FeedbackAuth obtained:', {
        length: data.feedbackAuth.length,
        signer: data.params?.signerAddress,
        expiry: data.params?.expiry ? new Date(data.params.expiry * 1000).toISOString() : 'N/A',
      });

      return data.feedbackAuth;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to request authorization';
      setError(errorMessage);
      console.error('❌ Error requesting feedbackAuth:', err);
      return null;

    } finally {
      setLoading(false);
    }
  };

  return {
    requestAuth,
    loading,
    error,
  };
}

