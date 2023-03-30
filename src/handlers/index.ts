import { exceptionMiddleware } from 'src/middleware/exception';
import { timeMiddleware } from 'src/middleware/time';
import { Telegraf } from 'telegraf';
import { helpHandler } from './help';
import { saveHandler } from './save';
import { startHandler } from './start';
import { messageHandler } from './text';

export function configureHandlers(bot: Telegraf) {
  bot.use(exceptionMiddleware, timeMiddleware);
  bot.command('start', startHandler);
  bot.command('save', saveHandler);
  bot.command('help', helpHandler);
  bot.on('message', messageHandler);
}
