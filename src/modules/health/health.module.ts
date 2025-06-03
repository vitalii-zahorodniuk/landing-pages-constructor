import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
