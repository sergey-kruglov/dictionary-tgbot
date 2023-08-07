import { Telegraf } from 'telegraf';
import { exceptionMiddleware } from '../middleware/exception';
import { callbackHandler } from './callback';
import { helpHandler } from './help';
import { messageHandler } from './message';
import { removeWordHandler } from './remove-word';
import { setIntervalHandler } from './set-interval';
import { setReminderHandler } from './set-reminder';
import { setTimeFrameHandler } from './set-timeframe';
import { setTimeZoneHandler } from './set-timezone';
import { startHandler } from './start';

// Configure middleware, commands and callbacks
export function configureHandlers(bot: Telegraf) {
  bot.use(exceptionMiddleware);
  bot.command('start', (ctx) => startHandler.handle(ctx));
  bot.command('removeWord', (ctx) => removeWordHandler.handle(ctx));
  bot.command('setReminder', (ctx) => setReminderHandler.handle(ctx));
  bot.command('setTimeFrame', (ctx) => setTimeFrameHandler.handle(ctx));
  bot.command('setInterval', (ctx) => setIntervalHandler.handle(ctx));
  bot.command('setTimeZone', (ctx) => setTimeZoneHandler.handle(ctx));
  bot.command('help', (ctx) => helpHandler.handle(ctx));
  bot.on('message', (ctx) => messageHandler.handle(ctx));
  bot.on('callback_query', (ctx) => callbackHandler.handle(ctx));
}
