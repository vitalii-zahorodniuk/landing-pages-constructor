import { createHash } from 'crypto';

/**
 * Generates an SHA-256 hash string based on the provided IP address and user agent.
 *
 * @param {string} ip - The IP address to include in the hash computation.
 * @param {string} userAgent - The user agent string to include in the hash computation.
 * @return {string}
 */
export function getUniqueRequestHash(
  ip: string,
  userAgent: string = '',
): string {
  return createHash('sha256')
    .update(ip + userAgent)
    .digest('hex');
}
