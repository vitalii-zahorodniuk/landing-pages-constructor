import { Request } from 'express';

/**
 * Extracts the client IP address from the given HTTP request, using common headers
 * such as `x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`, or falls back to
 * the socket remote address.
 *
 * @param {Request} request
 * @return {string}
 */
export function extractIP(request: Request): string {
  // Check headers
  const forwardedFor = request.headers['x-forwarded-for'];
  const realIP = request.headers['x-real-ip'];
  const cfConnectingIP = request.headers['cf-connecting-ip']; // Cloudflare

  let ip: string | undefined;

  // X-Forwarded-For (IPs list)
  if (forwardedFor) {
    ip = Array.isArray(forwardedFor)
      ? forwardedFor[0]
      : forwardedFor.split(',')[0]?.trim();
  }

  // X-Real-IP (Nginx)
  if (!ip && realIP && typeof realIP === 'string') {
    ip = realIP;
  }

  // CF-Connecting-IP (Cloudflare)
  if (!ip && cfConnectingIP && typeof cfConnectingIP === 'string') {
    ip = cfConnectingIP;
  }

  // Fallback to socket.remoteAddress or request.ip (Express)
  if (!ip) {
    ip = request.socket.remoteAddress || request.ip;
  }

  // Remove IPv6 prefix
  return ip?.replace(/^::ffff:/, '') || 'unknown';
}
