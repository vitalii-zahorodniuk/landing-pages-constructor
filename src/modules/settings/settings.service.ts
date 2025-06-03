import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { watch } from 'fs';
import { join } from 'path';
import { AppConfig } from './settings.types';
import { PageConfig, TrafficType } from '../../types';

// TODO Fix multiple initiation

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger(SettingsService.name);
  private config: AppConfig;
  private readonly configPath = join(process.cwd(), 'config.json');

  /**
   * Interface defining method called once the host module has been initialized.
   *
   * @see [Lifecycle Events](https://docs.nestjs.com/fundamentals/lifecycle-events)
   *
   * @publicApi
   */
  async onModuleInit() {
    await this.loadConfig();
    this.watchConfigFile();
  }

  /**
   * Retrieves the current application configuration settings.
   * If the configuration is not already loaded, it will load the configuration before returning it.
   *
   * @return {Promise<AppConfig>}
   */
  async getSettings(): Promise<AppConfig> {
    if (!this.config) {
      await this.loadConfig();
    }
    return this.config;
  }

  /**
   * Retrieves the configuration for a specific page type.
   *
   * @param {'white' | 'black'} pageType - The type of the page.
   * @return {Promise<PageConfig>}
   */
  async getPageConfig(pageType: TrafficType): Promise<PageConfig> {
    const config = await this.getSettings();
    return config.pages[pageType];
  }

  /**
   * Retrieves the rate limit configuration settings for the application.
   *
   * @return {Promise<AppConfig['rateLimit']>}
   */
  async getRateLimitConfig(): Promise<AppConfig['rateLimit']> {
    const config = await this.getSettings();
    return config.rateLimit;
  }

  /**
   * Retrieves the cloaking configuration settings for the application.
   *
   * @return {Promise<AppConfig['cloaking']>}
   */
  async getCloakingConfig(): Promise<AppConfig['cloaking']> {
    const config = await this.getSettings();
    return config.cloaking;
  }

  /**
   * Fetches the Progressive Web App (PWA) configuration settings.
   *
   * @return {Promise<AppConfig['pwa']>}
   */
  async getPWAConfig(): Promise<AppConfig['pwa']> {
    const config = await this.getSettings();
    return config.pwa;
  }

  /**
   * Loads the application's configuration
   *
   * @return {Promise<void>}
   */
  private async loadConfig(): Promise<void> {
    let configData: string = '';
    try {
      configData = await readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(configData) as AppConfig;
      this.logger.log(
        `Configuration loaded successfully, config: "${configData}"`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to load configuration, config file content: "${configData}"`,
        error,
      );
      throw error;
    }
  }

  /**
   * Watches the configuration file for changes and reloads the configuration when the file is modified.
   *
   * @return {void} This method does not return a value.
   */
  private watchConfigFile(): void {
    watch(this.configPath, (eventType) => {
      if (eventType === 'change') {
        this.logger.log('Configuration file changed, reloading...');
        void this.loadConfig(); // call and forget
      }
    });
  }
}
