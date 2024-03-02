import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';

export function configureShutdown(bot: Telegraf) {
  process.once('SIGINT', () => {
    bot.stop('SIGINT');
    mongoose.disconnect().catch((err) => {
      throw err;
    });
  });

  process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    mongoose.disconnect().catch((err) => {
      throw err;
    });
  });
}
