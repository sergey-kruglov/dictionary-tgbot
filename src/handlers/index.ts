import { exceptionMiddleware } from 'src/middleware/exception';
import { timeMiddleware } from 'src/middleware/time';
import { Telegraf } from 'telegraf';
import { callbackHandler } from './callback';
import { helpHandler } from './help';
import { messageHandler } from './message';
import { setIntervalHandler } from './set-interval';
import { setTimeZoneHandler } from './set-timezone';
import { startHandler } from './start';

export function configureHandlers(bot: Telegraf) {
  bot.use(exceptionMiddleware, timeMiddleware);
  bot.command('start', startHandler.handle);
  bot.command('setInterval', setIntervalHandler.handle);
  bot.command('setTimeZone', setTimeZoneHandler.handle);
  bot.command('help', helpHandler.handle);
  bot.on('message', messageHandler.handle);
  bot.on('callback_query', callbackHandler.handle);
}
