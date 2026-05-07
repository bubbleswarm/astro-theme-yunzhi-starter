/**
 * Hash 生成和映射工具
 * 用于将文章 ID 转换为短 hash URL
 */

// Base62 字符集（URL 安全）
const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * 将字符串转换为 Base62 编码的短 hash
 * 使用 FNV-1a 算法作为基础，然后转为 Base62
 */
export function generateHash(input: string): string {
  // FNV-1a 32-bit hash
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0;
  }

  // 转换为 Base62
  let result = '';
  let num = hash;
  do {
    result = BASE62[num % 62] + result;
    num = Math.floor(num / 62);
  } while (num > 0);

  // 确保至少 7 位
  while (result.length < 7) {
    result = `0${result}`;
  }

  return result.slice(0, 7);
}

/**
 * 为文章列表生成唯一的 hash 映射
 * 处理 hash 碰撞的情况
 */
export function generateHashMap(ids: string[]): Map<string, string> {
  const hashToId = new Map<string, string>();
  const idToHash = new Map<string, string>();

  for (const id of ids) {
    let hash = generateHash(id);
    let counter = 0;

    // 处理碰撞
    while (hashToId.has(hash)) {
      counter++;
      hash = generateHash(`${id}-${counter}`);
    }

    hashToId.set(hash, id);
    idToHash.set(id, hash);
  }

  return idToHash;
}

/**
 * 将 hash 映射转换为 JSON 对象（hash -> id）
 */
export function createReverseHashMap(ids: string[]): Record<string, string> {
  const hashToId: Record<string, string> = {};
  const idToHash = generateHashMap(ids);

  for (const [id, hash] of idToHash) {
    hashToId[hash] = id;
  }

  return hashToId;
}
