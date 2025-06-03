import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequestMetadata = createParamDecorator(
  (key: 'requestId' | 'startTime' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (key) {
      return request[key];
    }

    return {
      requestId: request.requestId,
      startTime: request.startTime,
      timestamp: request.pageData?.timestamp,
    };
  },
);
