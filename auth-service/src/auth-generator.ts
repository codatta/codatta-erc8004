/**
 * Feedback Authorization Generator
 * 生成 ReputationRegistry.giveFeedback 需要的 feedbackAuth 签名
 */

import { 
  keccak256, 
  encodeAbiParameters, 
  parseAbiParameters,
  concat,
  toHex,
  type Hex
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

export interface FeedbackAuthRequest {
  agentId: bigint;
  clientAddress: `0x${string}`;
  indexLimit?: bigint;  // 默认 10
  expiryDays?: number;  // 默认 30 天
}

export interface FeedbackAuthParams {
  agentId: bigint;
  clientAddress: `0x${string}`;
  indexLimit: bigint;
  expiry: bigint;
  chainId: number;
  identityRegistry: `0x${string}`;
  signerAddress: `0x${string}`;
}

export class AuthGenerator {
  private ownerAccount: ReturnType<typeof privateKeyToAccount>;
  private chainId: number;
  private identityRegistry: `0x${string}`;

  constructor(
    privateKey: `0x${string}`,
    chainId: number,
    identityRegistry: `0x${string}`
  ) {
    this.ownerAccount = privateKeyToAccount(privateKey);
    this.chainId = chainId;
    this.identityRegistry = identityRegistry;
  }

  /**
   * 生成 feedbackAuth (224 bytes struct + 65 bytes signature = 289 bytes)
   */
  async generateFeedbackAuth(request: FeedbackAuthRequest): Promise<Hex> {
    // 构造参数
    const params: FeedbackAuthParams = {
      agentId: request.agentId,
      clientAddress: request.clientAddress,
      indexLimit: request.indexLimit || 10n,
      expiry: BigInt(Math.floor(Date.now() / 1000) + (request.expiryDays || 30) * 86400),
      chainId: this.chainId,
      identityRegistry: this.identityRegistry,
      signerAddress: this.ownerAccount.address,
    };

    // 1. 编码结构体 (224 bytes)
    const structBytes = this.encodeAuthStruct(params);

    // 2. 构造消息哈希并签名
    const messageHash = this.constructMessageHash(params);
    const signature = await this.ownerAccount.signMessage({ 
      message: { raw: messageHash } 
    });

    // 3. 组合: struct + signature
    const feedbackAuth = concat([structBytes, signature]);

    // 验证长度
    // 224 bytes (struct) + 65 bytes (signature) = 289 bytes
    // 289 bytes = 578 hex chars + "0x" prefix = 580 chars
    if (feedbackAuth.length !== 580) {
      throw new Error(`Invalid feedbackAuth length: ${feedbackAuth.length}, expected 580 (289 bytes)`);
    }

    return feedbackAuth;
  }

  /**
   * 编码 FeedbackAuth 结构体 (224 bytes)
   */
  private encodeAuthStruct(params: FeedbackAuthParams): Hex {
    return encodeAbiParameters(
      parseAbiParameters('uint256, address, uint64, uint256, uint256, address, address'),
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
   * 构造需要签名的消息哈希
   */
  private constructMessageHash(params: FeedbackAuthParams): Hex {
    return keccak256(
      encodeAbiParameters(
        parseAbiParameters('uint256, address, uint64, uint256, uint256, address, address'),
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
   * 获取签名者地址（Agent owner）
   */
  getSignerAddress(): `0x${string}` {
    return this.ownerAccount.address;
  }

  /**
   * 验证请求参数
   */
  validateRequest(request: FeedbackAuthRequest): { valid: boolean; error?: string } {
    // 验证 agentId
    if (!request.agentId || request.agentId <= 0n) {
      return { valid: false, error: 'Invalid agentId' };
    }

    // 验证 clientAddress
    if (!request.clientAddress || !request.clientAddress.startsWith('0x')) {
      return { valid: false, error: 'Invalid clientAddress' };
    }

    // 验证 indexLimit
    if (request.indexLimit && request.indexLimit <= 0n) {
      return { valid: false, error: 'indexLimit must be positive' };
    }

    // 验证 expiryDays
    if (request.expiryDays && (request.expiryDays <= 0 || request.expiryDays > 365)) {
      return { valid: false, error: 'expiryDays must be between 1 and 365' };
    }

    return { valid: true };
  }
}

