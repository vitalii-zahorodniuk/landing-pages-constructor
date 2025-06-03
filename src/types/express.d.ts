import { TrafficType } from './types';

declare global {
  namespace Express {
    interface Request {
      pageData?: {
        trafficType: TrafficType;
        config: PageConfig;
        timestamp: number;
        clientInfo: {
          ip: string;
          userAgent: string;
          referer?: string;
        };
      };
      requestId?: string;
      startTime?: number;
    }
  }
}

export interface PageConfig {
  html: string;
  title: string;
  description: string;
}
