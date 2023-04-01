export class AppConfig {
  readonly mongodb = {
    uri: process.env.MONGODB_URI || '',
  };
  readonly token = {
    telegram: process.env.TOKEN_TELEGRAM || '',
    rapidApi: process.env.TOKEN_RAPID_API || '',
  };
}

export const appConfig = new AppConfig();
