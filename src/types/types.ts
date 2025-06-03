import { TRAFFIC_TYPES } from '../constants';

export type TrafficType = (typeof TRAFFIC_TYPES)[keyof typeof TRAFFIC_TYPES];

export interface DatabaseStatus {
  isConnected: boolean;
  status: string;
  host?: string;
  database?: string;
  readyState: number;
}
