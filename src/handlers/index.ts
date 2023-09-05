import { Telegraf } from 'telegraf';
import { setReminderHandler } from '../commands/set-reminder';
import { exceptionMiddleware } from '../middleware/exception';
import { callbackHandler } from './callback';
import { helpHandler } from './help';
import { listTimeZonesHandler } from './list-timezones';
import { messageHandler } from './message';
import { randomWordHandler } from './random-word';
import { removeWordHandler } from './remove-word';
import { setIntervalHandler } from './set-interval';
import { setTimeFrameHandler } from './set-timeframe';
import { setTimeZoneHandler } from './set-timezone';
import { startHandler } from './start';

const commands = [
  { name: 'start', handler: startHandler.handle },
  { name: 'randomword', handler: randomWordHandler.handle },
  { name: 'removeword', handler: removeWordHandler.handle },
  { name: 'setreminder', handler: setReminderHandler.handle },
  { name: 'settimeframe', handler: setTimeFrameHandler.handle },
  { name: 'setinterval', handler: setIntervalHandler.handle },
  { name: 'settimezone', handler: setTimeZoneHandler.handle },
  { name: 'listtimezones', handler: listTimeZonesHandler.handle },
  { name: 'help', handler: helpHandler.handle },
];

// Configure middleware, commands and callbacks
export function configureHandlers(bot: Telegraf) {
  bot.use(exceptionMiddleware);

  bot.on('message', (ctx) => messageHandler.handle(ctx));
  bot.on('callback_query', (ctx) => callbackHandler.handle(ctx));

  for (const command of commands) {
    bot.command(command.name, command.handler);
  }
}
