import { Telegraf } from 'telegraf';
import { exceptionMiddleware } from '../middleware/exception';
import { callbackHandler } from './callback';
import { helpHandler } from './help';
import { listTimeZonesHandler } from './list-timezones';
import { messageHandler } from './message';
import { randomWordHandler } from './random-word';
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
  bot.command('randomword', (ctx) => randomWordHandler.handle(ctx));
  bot.command('removeword', (ctx) => removeWordHandler.handle(ctx));
  bot.command('setreminder', (ctx) => setReminderHandler.handle(ctx));
  bot.command('settimeframe', (ctx) => setTimeFrameHandler.handle(ctx));
  bot.command('setinterval', (ctx) => setIntervalHandler.handle(ctx));
  bot.command('settimezone', (ctx) => setTimeZoneHandler.handle(ctx));
  bot.command('listtimezones', (ctx) => listTimeZonesHandler.handle(ctx));
  bot.command('help', (ctx) => helpHandler.handle(ctx));
  bot.on('message', (ctx) => messageHandler.handle(ctx));
  bot.on('callback_query', (ctx) => callbackHandler.handle(ctx));
}
