import { ExecutionContext, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class ThrottlingGuard extends ThrottlerGuard {
  protected generateKey(context: ExecutionContext): string {
    const request = context.switchToHttp().getRequest<Request>();
    const clientIp = this.getClientIp(request);
    return `throttler_${clientIp}`;
  }

  private getClientIp(request: Request): string {
    // Check x-real-ip
    const realIp = request.headers['x-real-ip'];
    if (typeof realIp === 'string') {
      return realIp.trim();
    }

    // Check x-forwarded-for
    const forwardedFor = request.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string') {
      const firstIp = forwardedFor.split(',')[0];
      if (firstIp) {
        return firstIp.trim();
      }
    }

    // Check request.ip
    if (request.ip) {
      return request.ip;
    }

    // Check socket.remoteAddress
    if (request.socket?.remoteAddress) {
      return request.socket.remoteAddress;
    }

    return 'unknown';
  }
}
