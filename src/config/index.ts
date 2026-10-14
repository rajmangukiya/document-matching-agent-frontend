class AppConfig {
  private static instance: AppConfig;
  public readonly apiBaseUrl: string;
  public readonly appName = 'Document Matching Agent';

  private constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
  }

  public static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }
}

export default AppConfig.getInstance();
