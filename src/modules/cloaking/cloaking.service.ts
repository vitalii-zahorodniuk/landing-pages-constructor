import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import { SettingsService } from '../settings/settings.service';
import { TRAFFIC_TYPES } from '../../constants';
import { TrafficType } from '../../types';
import { extractIP, getUniqueRequestHash } from '../../helpers';

@Injectable()
export class CloakingService {
  private readonly logger = new Logger(CloakingService.name);

  constructor(
    private readonly settingsService: SettingsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Analyzes incoming traffic to determine whether the traffic is blacklisted or whitelisted.
   *
   * @param {Request} request
   * @return {Promise<TrafficType>}
   */
  async analyzeTraffic(request: Request): Promise<TrafficType> {
    const cloakingConfig = await this.settingsService.getCloakingConfig();

    // Show black if cloaking disabled
    if (!cloakingConfig.enabled) {
      return TRAFFIC_TYPES.BLACK;
    }

    // Get IP and User Agent
    const ip = extractIP(request);
    const userAgent = request.headers['user-agent'] || '';

    // Create a cache key
    const cacheKey = `traffic:${getUniqueRequestHash(ip, userAgent)}`;

    // Check cache
    const cached = await this.cacheManager.get<TrafficType>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for ${cacheKey}: ${cached}`);
      return cached;
    }

    let result: TrafficType = TRAFFIC_TYPES.BLACK;

    try {
      // User Agent local check
      if (cloakingConfig.enabledChecks.UACheck) {
        if (result === TRAFFIC_TYPES.BLACK && this.isBot(userAgent)) {
          result = TRAFFIC_TYPES.WHITE;
          this.logger.debug(`Bot detected by UA: ${userAgent}`);
        }
      }

      // IP local check
      if (cloakingConfig.enabledChecks.IPCheck) {
        if (result === TRAFFIC_TYPES.BLACK && this.isSuspiciousIP(ip)) {
          result = TRAFFIC_TYPES.WHITE;
          this.logger.debug(`Suspicious IP detected: ${ip}`);
        }
      }

      // VPN API check
      if (
        result === TRAFFIC_TYPES.BLACK &&
        cloakingConfig.enabledChecks.vpnapi
      ) {
        const VPNAPICheckResult = await this.checkVPNAPI(ip);
        if (VPNAPICheckResult) {
          result = TRAFFIC_TYPES.WHITE;
          this.logger.debug(`VPNAPI detected bot for IP: ${ip}`);
        }
      }
    } catch (error) {
      this.logger.error('Error during traffic analysis', error);
      result = TRAFFIC_TYPES.WHITE;
    }

    // Cache result
    await this.cacheManager.set(cacheKey, result, 300);

    this.logger.debug(`Traffic analysis result for ${ip}: ${result}`);
    return result;
  }

  /**
   * Determines whether the provided user agent string corresponds to a bot by
   * checking for common bot patterns.
   *
   * @param {string} userAgent
   * @return {boolean}
   */
  private isBot(userAgent: string): boolean {
    const botPatterns = [
      'curl',
      'wget',
      'python-requests',
      'go-http-client',
      'libwww-perl',
      'bot',
      'spider',
      'crawler',
      'scrapy',
      'httpclient',
      'java',
      'scan',
      'headless',
      'phantomjs',
      'node-fetch',
      'axios',
      'postman',
    ];

    return botPatterns.some((pattern) =>
      userAgent.toLowerCase().includes(pattern),
    );
  }

  /**
   * Checks if the given IP address matches patterns associated with suspicious or private local IPs.
   *
   * @param {string} ip
   * @return {boolean}
   */
  private isSuspiciousIP(ip: string): boolean {
    const localPatterns = [
      /^127\./, // localhost
      /^10\./, // private
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // private
      /^192\.168\./, // private
      /^::1$/, // IPv6 localhost
      /^fc00:/, // IPv6 private
    ];

    return localPatterns.some((pattern) => pattern.test(ip));
  }

  /**
   * Checks if the given IP address is associated with a VPN using an API call.
   *
   * @param {string} ip
   * @return {Promise<boolean>}
   */
  private async checkVPNAPI(ip: string): Promise<boolean> {
    // TODO Implement VPN API check

    // Simulate VPN API check
    const isVPN = Math.random() < 0.5;

    this.logger.debug(`VPN check result: ${ip} -> ${isVPN}`);

    return Promise.resolve(isVPN);
  }
}
