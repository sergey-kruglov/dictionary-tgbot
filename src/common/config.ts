export class AppConfig {
  readonly mongodbUri = process.env.MONGODB_URI || '';
  readonly telegramToken = process.env.TELEGRAM_TOKEN || '';
  readonly rapidApiKey = process.env.RAPID_API_KEY || '';
}

export const appConfig = new AppConfig();
