import { timeMiddleware } from 'src/middleware/time';
import { Telegraf } from 'telegraf';
import { saveHandler } from './save';
import { startHandler } from './start';
import { messageHandler } from './text';

export function configureHandlers(bot: Telegraf) {
  bot.use(timeMiddleware);
  bot.command('start', startHandler);
  bot.command('save', saveHandler);
  bot.on('message', messageHandler);
}
