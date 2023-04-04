export class AppConfig {
  readonly mongodbUri = process.env.MONGODB_URI || '';
  readonly telegramToken = process.env.TELEGRAM_TOKEN || '';
}

export const appConfig = new AppConfig();
