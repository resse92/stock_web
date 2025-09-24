import type { AppConfig } from '@/types/api';

/**
 * Environment configuration manager
 * Loads configuration from environment variables with fallback defaults
 */
class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    return {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
      wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws',
      apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
      environment: import.meta.env.VITE_APP_ENV || 'development',
    };
  }

  public getConfig(): AppConfig {
    return { ...this.config };
  }

  public get apiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  public get wsUrl(): string {
    return this.config.wsUrl;
  }

  public get apiTimeout(): number {
    return this.config.apiTimeout;
  }

  public get environment(): string {
    return this.config.environment;
  }

  public get isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  public get isProduction(): boolean {
    return this.config.environment === 'production';
  }
}

// Export singleton instance
export const config = new ConfigManager();
export default config;