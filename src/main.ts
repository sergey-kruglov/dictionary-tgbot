import { Bot } from "https://deno.land/x/grammy@v1.31.3/mod.ts";

import mongoose from "npm:mongoose@8.8.0";
import { appConfig } from "./common/config.ts";
import { configureHandlers } from "./handlers/index.ts";
import { Settings } from "./models/index.ts";
import { Scheduler } from "./scheduler.ts";

async function initAppSettings() {
  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({ requestCount: 0, counterResetDate: new Date() });
  }
}

async function run() {
  console.log({ appConfig });
  const bot = new Bot(appConfig.telegramToken);

  await mongoose.connect(appConfig.mongodbUri);
  await initAppSettings();

  configureHandlers(bot);

  bot.start();
  Scheduler.start(bot);

  console.log("Bot started");
}

run();
