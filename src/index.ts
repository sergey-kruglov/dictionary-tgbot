import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import { appConfig } from './common/config';
import { configureShutdown } from './common/shutdown';
import { configureHandlers } from './handlers';

async function run() {
  const bot = new Telegraf(appConfig.telegramToken);
  configureHandlers(bot);
  configureShutdown(bot);
  await mongoose.connect(appConfig.mongodbUri);
  await bot.launch();
}

run().catch((err) => {
  throw err;
});
