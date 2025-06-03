import { TrafficType } from '../../types/types';

export interface LogRequestData {
  requestId?: string;
  ip: string;
  userAgent: string;
  url: string;
  method: string;
  trafficType: TrafficType;
  fromCache?: boolean;
  blocked?: boolean;
  statusCode?: number;
  cloakingChecks?: {
    UACheck?: boolean;
    IPCheck?: boolean;
    vpnapi?: boolean;
  };
  comment?: string;
}
