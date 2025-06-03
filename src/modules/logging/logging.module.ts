import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggingService } from './logging.service';
import { RequestLog, RequestLogSchema } from './schemas/request-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RequestLog.name, schema: RequestLogSchema },
    ]),
  ],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
