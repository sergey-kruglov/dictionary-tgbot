import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import { appConfig } from './common/config';
import { configureShutdown } from './common/shutdown';
import { configureHandlers } from './handlers';
import { Settings } from './models';
// import { Scheduler } from './scheduler';

async function run() {
  const bot = new Telegraf(appConfig.telegramToken);
  configureHandlers(bot);
  configureShutdown(bot);

  await mongoose.connect(appConfig.mongodbUri);
  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({ requestCount: 0, counterResetDate: new Date() });
  }

  bot.launch().catch((err) => console.log(err));
  // Scheduler.start(bot);
}

run().catch((err) => {
  throw err;
});
