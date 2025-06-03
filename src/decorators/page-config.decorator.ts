import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';

export const PageConfig = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.pageData?.config) {
      throw new InternalServerErrorException(
        'PageDataInterceptor must be applied',
      );
    }

    return request.pageData.config;
  },
);
