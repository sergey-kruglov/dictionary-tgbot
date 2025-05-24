export class AppConfig {
  readonly mongodbUri: string;
  readonly telegramToken: string;
  readonly rapidApiKey: string;

  constructor(env: Deno.Env) {
    this.mongodbUri = this.getOrFail(env, "MONGODB_URI");
    this.telegramToken = this.getOrFail(env, "TELEGRAM_TOKEN");
    this.rapidApiKey = this.getOrFail(env, "RAPID_API_KEY");
  }

  private getOrFail(env: Deno.Env, name: string): string {
    const value = env.get(name);
    if (!value) {
      throw new Error(`missing env parameter: ${name}`);
    }
    return value;
  }
}

export const appConfig = new AppConfig(Deno.env);
