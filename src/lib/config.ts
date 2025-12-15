import type { AppConfig } from '@/types/api'

/**
 * Environment configuration manager
 * Loads configuration from environment variables with fallback defaults
 */
class ConfigManager {
  private config: AppConfig

  constructor() {
    this.config = this.loadConfig()
  }

  private loadConfig(): AppConfig {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn(
        'Supabase environment variables are missing. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable Supabase features.'
      )
    }

    return {
      apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
      wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws',
      apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
      environment: import.meta.env.VITE_APP_ENV || 'development',
      supabaseUrl: supabaseUrl || '',
      supabaseAnonKey: supabaseAnonKey || '',
    }
  }

  public getConfig(): AppConfig {
    return { ...this.config }
  }

  public get apiBaseUrl(): string {
    return this.config.apiBaseUrl
  }

  public get wsUrl(): string {
    return this.config.wsUrl
  }

  public get apiTimeout(): number {
    return this.config.apiTimeout
  }

  public get environment(): string {
    return this.config.environment
  }

  public get isDevelopment(): boolean {
    return this.config.environment === 'development'
  }

  public get isProduction(): boolean {
    return this.config.environment === 'production'
  }

  public get supabaseUrl(): string {
    return this.config.supabaseUrl
  }

  public get supabaseAnonKey(): string {
    return this.config.supabaseAnonKey
  }

  public get supabaseConfig(): { url: string; anonKey: string } {
    return { url: this.supabaseUrl, anonKey: this.supabaseAnonKey }
  }
}

// Export singleton instance
export const config = new ConfigManager()
export default config
