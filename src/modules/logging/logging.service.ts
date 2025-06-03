import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RequestLog } from './schemas/request-log.schema';
import { v4 as uuidv4 } from 'uuid';
import { LogRequestData } from './logging.types';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger(LoggingService.name);

  constructor(
    @InjectModel(RequestLog.name) private requestLogModel: Model<RequestLog>,
  ) {}

  async logRequest(data: LogRequestData): Promise<void> {
    try {
      const logEntry = new this.requestLogModel({
        ...data,
        requestId: data.requestId || uuidv4(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      await logEntry.save();

      this.logger.debug(
        `Request logged: ${logEntry.requestId} - ${data.trafficType} - ${data.ip}`,
      );
    } catch (error) {
      this.logger.error('Failed to log request', error);
    }
  }

  /**
   * Here we can:
   * - Count white vs. black traffic distribution
   * - Track blocked requests ratio
   * - Monitor cache hit rates
   * - Detect IPs with excessive request rates
   * - Identify users with multiple different user agents
   * - Track UACheck detection effectiveness
   * - Monitor IPCheck trigger rates
   * - Analyze VPN API detection success
   * - Retrieve latest request entries for monitoring
   * - Add investigation notes to suspicious requests
   * - etc...
   */
}
