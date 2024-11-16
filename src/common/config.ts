export class AppConfig {
  readonly mongodbUri = Deno.env.get('MONGODB_URI') ?? '';
  readonly telegramToken = Deno.env.get('TELEGRAM_TOKEN') ?? '';
  readonly rapidApiKey = Deno.env.get('RAPID_API_KEY') ?? '';
}

export const appConfig = new AppConfig();
