export class Config {
  static readonly app = {
    ownerHash: process.env.APP_OWNER_HASH as string,
  };
  static readonly telegram = {
    token: process.env.TELEGRAM_TOKEN as string,
  };
}
