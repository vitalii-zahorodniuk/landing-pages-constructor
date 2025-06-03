import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request } from 'express';
import * as Types from '../types/types';

export const TrafficType = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Types.TrafficType => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.pageData?.trafficType) {
      throw new InternalServerErrorException(
        'PageDataInterceptor must be applied',
      );
    }

    return request.pageData.trafficType;
  },
);
