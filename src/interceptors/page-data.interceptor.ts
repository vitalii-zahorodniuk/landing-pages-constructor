import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { CloakingService } from '../modules/cloaking/cloaking.service';
import { SettingsService } from '../modules/settings/settings.service';
import { v4 as uuidv4 } from 'uuid';

// TODO
@Injectable()
export class PageDataInterceptor implements NestInterceptor {
  constructor(
    private readonly cloakingService: CloakingService,
    private readonly settingsService: SettingsService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    request.requestId = uuidv4();
    request.startTime = Date.now();

    const clientInfo = this.extractClientInfo(request);
    const trafficType = await this.cloakingService.analyzeTraffic(request);
    const config = await this.settingsService.getPageConfig(trafficType);

    request.pageData = {
      trafficType,
      config,
      timestamp: Date.now(),
      clientInfo,
    };

    return next.handle();
  }

  private extractClientInfo(request: Request) {
    const forwarded = request.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded?.split(',')[0] ||
        request.connection.remoteAddress ||
        request.ip;

    return {
      ip: ip || 'unknown',
      userAgent: request.headers['user-agent'] || 'unknown',
      referer: request.headers.referer,
    };
  }
}
