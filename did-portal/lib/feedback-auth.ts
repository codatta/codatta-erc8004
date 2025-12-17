/**
 * Feedback Authorization Helper
 * 生成 giveFeedback 需要的 feedbackAuth 参数
 */

import { encodeAbiParameters, keccak256, toHex, concat } from 'viem';

export interface FeedbackAuthParams {
  agentId: bigint;
  clientAddress: `0x${string}`;
  indexLimit: bigint;
  expiry: bigint;
  chainId: number;
  identityRegistry: `0x${string}`;
  signerAddress: `0x${string}`;
}

/**
 * 构造需要签名的消息
 */
export function constructFeedbackAuthMessage(params: FeedbackAuthParams): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'agentId', type: 'uint256' },
        { name: 'clientAddress', type: 'address' },
        { name: 'indexLimit', type: 'uint64' },
        { name: 'expiry', type: 'uint256' },
        { name: 'chainId', type: 'uint256' },
        { name: 'identityRegistry', type: 'address' },
        { name: 'signerAddress', type: 'address' },
      ],
      [
        params.agentId,
        params.clientAddress,
        params.indexLimit,
        params.expiry,
        BigInt(params.chainId),
        params.identityRegistry,
        params.signerAddress,
      ]
    )
  );
}

/**
 * 编码 FeedbackAuth 结构体（前 224 字节）
 */
export function encodeFeedbackAuthStruct(params: FeedbackAuthParams): `0x${string}` {
  return encodeAbiParameters(
    [
      { name: 'agentId', type: 'uint256' },
      { name: 'clientAddress', type: 'address' },
      { name: 'indexLimit', type: 'uint64' },
      { name: 'expiry', type: 'uint256' },
      { name: 'chainId', type: 'uint256' },
      { name: 'identityRegistry', type: 'address' },
      { name: 'signerAddress', type: 'address' },
    ],
    [
      params.agentId,
      params.clientAddress,
      params.indexLimit,
      params.expiry,
      BigInt(params.chainId),
      params.identityRegistry,
      params.signerAddress,
    ]
  );
}

/**
 * 组合 feedbackAuth (224 字节结构体 + 65 字节签名)
 * @param params - 授权参数
 * @param signature - Agent owner 的签名（65 字节）
 */
export function buildFeedbackAuth(
  params: FeedbackAuthParams,
  signature: `0x${string}`
): `0x${string}` {
  const structBytes = encodeFeedbackAuthStruct(params);
  return concat([structBytes, signature]);
}

/**
 * 生成 feedbackHash
 * @param feedbackUri - 反馈 URI
 * @param score - 评分
 * @param tag1 - 标签1
 * @param tag2 - 标签2
 */
export function generateFeedbackHash(
  feedbackUri: string,
  score: number,
  tag1: `0x${string}`,
  tag2: `0x${string}`
): `0x${string}` {
  return keccak256(
    encodeAbiParameters(
      [
        { name: 'feedbackUri', type: 'string' },
        { name: 'score', type: 'uint8' },
        { name: 'tag1', type: 'bytes32' },
        { name: 'tag2', type: 'bytes32' },
      ],
      [feedbackUri, score, tag1, tag2]
    )
  );
}

/**
 * 简化版本：使用空 feedbackHash
 * 如果不需要防篡改验证，可以使用这个
 */
export function getEmptyFeedbackHash(): `0x${string}` {
  return '0x0000000000000000000000000000000000000000000000000000000000000000';
}

