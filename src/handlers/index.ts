import { Telegraf } from 'telegraf';
import { exceptionMiddleware } from '../middleware/exception';
import { timeMiddleware } from '../middleware/time';
import { callbackHandler } from './callback';
import { helpHandler } from './help';
import { messageHandler } from './message';
import { setIntervalHandler } from './set-interval';
import { setTimeZoneHandler } from './set-timezone';
import { startHandler } from './start';

export function configureHandlers(bot: Telegraf) {
  bot.use(exceptionMiddleware, timeMiddleware);
  bot.command('start', (ctx) => startHandler.handle(ctx));
  bot.command('setInterval', (ctx) => setIntervalHandler.handle(ctx));
  bot.command('setTimeZone', (ctx) => setTimeZoneHandler.handle(ctx));
  bot.command('help', (ctx) => helpHandler.handle(ctx));
  bot.on('message', (ctx) => messageHandler.handle(ctx));
  bot.on('callback_query', (ctx) => callbackHandler.handle(ctx));
}
