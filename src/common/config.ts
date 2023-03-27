export class AppConfig {
  readonly app = {
    ownerHash: process.env.APP_OWNER_HASH || '',
  };
  readonly mongodb = {
    uri: process.env.MONGODB_URI || '',
  };
  readonly telegram = {
    token: process.env.TELEGRAM_TOKEN || '',
  };
}

export const appConfig = new AppConfig();
