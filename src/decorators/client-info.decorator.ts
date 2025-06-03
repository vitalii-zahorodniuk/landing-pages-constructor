import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const ClientInfo = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.pageData?.clientInfo) {
      throw new InternalServerErrorException(
        'PageDataInterceptor must be applied',
      );
    }

    return request.pageData.clientInfo;
  },
);
