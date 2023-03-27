import { Telegraf } from 'telegraf';
import { timeMiddleware } from '../middleware/time';
import { saveHandler } from './save';
import { startHandler } from './start';
import { messageHandler } from './text';

export function configureHandlers(bot: Telegraf) {
  bot.use(timeMiddleware);
  bot.command('start', startHandler);
  bot.command('save', saveHandler);
  bot.on('message', messageHandler);
}
