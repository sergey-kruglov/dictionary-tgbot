import { exceptionMiddleware } from 'src/middleware/exception';
import { timeMiddleware } from 'src/middleware/time';
import { Telegraf } from 'telegraf';
import { authHandler } from './auth';
import { callbackHandler } from './callback';
import { helpHandler } from './help';
import { messageHandler } from './message';
import { startHandler } from './start';

export function configureHandlers(bot: Telegraf) {
  bot.use(exceptionMiddleware, timeMiddleware);
  bot.command('start', startHandler);
  bot.command('auth', authHandler);
  bot.command('help', helpHandler);
  bot.on('message', messageHandler);
  bot.on('callback_query', callbackHandler);
}
