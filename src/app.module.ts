import { Module } from '@nestjs/common';
import { LandingModule } from './modules/landing/landing.module';
import { CloakingModule } from './modules/cloaking/cloaking.module';
import { SettingsModule } from './modules/settings/settings.module';
import { LoggingModule } from './modules/logging/logging.module';
import { HealthModule } from './modules/health/health.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { SettingsService } from './modules/settings/settings.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>(
          'MONGO_URL',
          'mongodb://localhost:27017/landing-pages-constructor-db',
        ),
      }),
    }),
    CacheModule.registerAsync({
      inject: [ConfigService],
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
        ttl: 24 * 60 * 60 * 1000, // 24 hours
      }),
    }),
    SettingsModule,
    ThrottlerModule.forRootAsync({
      inject: [SettingsService],
      useFactory: async (settingsService: SettingsService) => {
        const config = await settingsService.getRateLimitConfig();
        return [
          {
            ttl: config.duration * 1000, // convert to ms
            limit: config.limit,
          },
        ];
      },
    }),
    LandingModule,
    CloakingModule,
    LoggingModule,
    HealthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
