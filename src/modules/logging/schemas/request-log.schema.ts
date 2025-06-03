import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { TrafficType } from '../../../types';

@Schema({ timestamps: true })
export class RequestLog extends Document {
  @Prop({ required: true })
  requestId: string;

  @Prop({ required: true })
  ip: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  method: string;

  @Prop({ required: true })
  trafficType: TrafficType;

  @Prop({ default: false })
  fromCache: boolean;

  @Prop({ default: false })
  blocked: boolean;

  @Prop()
  statusCode?: number;

  @Prop({ type: Object })
  cloakingChecks?: {
    UACheck?: boolean;
    IPCheck?: boolean;
    vpnapi?: boolean;
  };

  @Prop()
  comment?: string;

  @Prop({ expires: '7d' })
  expiresAt: Date;
}

export const RequestLogSchema = SchemaFactory.createForClass(RequestLog);

RequestLogSchema.index({ requestId: 1 }, { unique: true });
RequestLogSchema.index({ ip: 1, createdAt: -1 });
RequestLogSchema.index({ trafficType: 1, createdAt: -1 });
RequestLogSchema.index({ blocked: 1, createdAt: -1 });
