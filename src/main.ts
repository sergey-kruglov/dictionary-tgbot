import { Bot } from "https://deno.land/x/grammy@v1.31.3/mod.ts";

import mongoose from "npm:mongoose@8.8.0";
import { appConfig } from "./common/config.ts";
import { logger } from "./common/logger.ts";
import { initHandlers } from "./handlers/index.ts";
import { Settings } from "./models/index.ts";
import { initScheduler } from "./scheduler.ts";

async function initAppSettings() {
  const settings = await Settings.findOne();
  if (!settings) {
    await Settings.create({
      type: "app",
      requestCount: 0,
      counterResetDate: new Date(),
    });
  }
}

async function bootstrap() {
  const bot = new Bot(appConfig.telegramToken);

  await mongoose.connect(appConfig.mongodbUri);
  await initAppSettings();
  initHandlers(bot);

  bot.start();
  initScheduler(bot);

  logger.log("Bot started");
}

bootstrap();
