import { PageConfig } from '../../types';

export interface AppConfig {
  cloaking: {
    enabled: boolean;
    enabledChecks: {
      UACheck: boolean;
      IPCheck: boolean;
      vpnapi: boolean;
    };
  };
  pages: {
    white: PageConfig;
    black: PageConfig;
  };
  pwa: {
    manifest: any;
  };
  rateLimit: {
    enabled: boolean;
    limit: number;
    duration: number;
  };
}
