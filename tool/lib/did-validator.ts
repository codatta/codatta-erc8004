// DID 格式验证工具

/**
 * 验证是否为有效的 UUID v4 格式
 * 格式: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * - 第三组第一个字符必须是 4 (version)
 * - 第四组第一个字符必须是 8, 9, a, b (variant)
 */
export function isValidUUIDv4(uuid: string): boolean {
  const uuidv4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(uuid);
}

/**
 * 验证是否为有效的 Codatta DID 格式
 * 格式: did:codatta:<UUID-v4>
 * 
 * @param did - DID 字符串
 * @returns 是否为有效的 Codatta DID
 */
export function isValidCodattaDID(did: string): boolean {
  // 检查基本格式
  if (!did || typeof did !== 'string') {
    return false;
  }

  // 检查前缀
  const prefix = 'did:codatta:';
  if (!did.startsWith(prefix)) {
    return false;
  }

  // 提取 UUID 部分
  const uuid = did.slice(prefix.length);

  // 验证 UUID v4 格式
  return isValidUUIDv4(uuid);
}

/**
 * 解析 DID 并返回详细信息
 * 
 * @param did - DID 字符串
 * @returns 解析结果对象
 */
export function parseCodattaDID(did: string): {
  valid: boolean;
  error?: string;
  method?: string;
  uuid?: string;
} {
  if (!did || typeof did !== 'string') {
    return {
      valid: false,
      error: 'DID 必须是字符串',
    };
  }

  // 检查格式: did:codatta:uuid
  const parts = did.split(':');
  
  if (parts.length !== 3) {
    return {
      valid: false,
      error: 'DID 格式错误，应为 did:codatta:<UUID>',
    };
  }

  const [scheme, method, uuid] = parts;

  if (scheme !== 'did') {
    return {
      valid: false,
      error: 'DID 必须以 "did:" 开头',
    };
  }

  if (method !== 'codatta') {
    return {
      valid: false,
      error: 'DID method 必须是 "codatta"',
    };
  }

  if (!isValidUUIDv4(uuid)) {
    return {
      valid: false,
      error: 'UUID 必须是有效的 v4 格式 (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)',
    };
  }

  return {
    valid: true,
    method,
    uuid,
  };
}


