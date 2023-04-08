import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import { appConfig } from './common/config';
import { configureShutdown } from './common/shutdown';
import { configureHandlers } from './handlers';
import { Scheduler } from './scheduler';

async function run() {
  const bot = new Telegraf(appConfig.telegramToken);
  configureHandlers(bot);
  configureShutdown(bot);
  await mongoose.connect(appConfig.mongodbUri);
  bot.launch().catch((err) => console.log(err));
  Scheduler.start(bot);
}

run().catch((err) => {
  throw err;
});
