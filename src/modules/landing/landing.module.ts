import { Module } from '@nestjs/common';
import { LandingController } from './landing.controller';
import { CloakingModule } from '../cloaking/cloaking.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [CloakingModule, LoggingModule],
  controllers: [LandingController],
  providers: [],
})
export class LandingModule {}
