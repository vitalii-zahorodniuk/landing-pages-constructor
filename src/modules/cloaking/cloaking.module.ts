import { Module } from '@nestjs/common';
import { CloakingService } from './cloaking.service';

@Module({
  providers: [CloakingService],
  exports: [CloakingService],
})
export class CloakingModule {}
