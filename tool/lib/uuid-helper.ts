// UUID 转换工具
// 将 agentId 转换为 UUID v4 格式的 DID

/**
 * 将 agentId 转换为 UUID 格式
 * @param value - Agent ID (bigint)
 * @returns UUID v4 字符串
 */
export function uint128ToUUID(value: bigint): string {
    if (typeof value !== 'bigint') throw new TypeError('value must be a bigint');
    if (value < BigInt("0")) throw new RangeError('value must be non-negative');
    if (value > ((BigInt("1") << BigInt("128")) - BigInt("1"))) {
      throw new RangeError('value must be < 2^128');
    }
  
    // Convert bigint → 16 bytes (big-endian)
    const bytes = new Uint8Array(16);
    let v = value;
    for (let i = 15; i >= 0; i--) {
      bytes[i] = Number(v & BigInt("0xff"));
      v >>= 8n;
    }
  
    // ----- Force Version = 4 -----
    // version (4 bits) is highest 4 bits of bytes[6]
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
  
    // ----- Force Variant = RFC-4122 -----
    // highest 2 bits of bytes[8] must be "10"
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
  
    // Convert to UUID format xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return [
      hex.slice(0, 8),
      hex.slice(8, 12),
      hex.slice(12, 16),
      hex.slice(16, 20),
      hex.slice(20, 32),
    ].join('-');
  }

/**
 * 生成 DID 格式的标识符
 * @param agentId - Agent ID (bigint)
 * @returns did:codatta:<UUID> 格式的字符串
 */
export function formatAgentDID(agentId: bigint): string {
  const uuid = uint128ToUUID(agentId);
  return `did:codatta:${uuid}`;
}

