import { Telegraf } from 'telegraf';
import { helpCommand } from '../commands/help';
import { listTimeZonesHandler } from '../commands/list-timezones';
import { randomWordCommand } from '../commands/random-word';
import { removeWordCommand } from '../commands/remove-word';
import { setIntervalCommand } from '../commands/set-interval';
import { setReminderCommand } from '../commands/set-reminder';
import { setTimeFrameCommand } from '../commands/set-timeframe';
import { setTimeZoneCommand } from '../commands/set-timezone';
import { startCommand } from '../commands/start';
import { CommandCtx } from '../common/types';
import { Command } from '../interfaces/handler';
import { exceptionMiddleware } from '../middleware/exception';
import { callbackHandler } from './callback';
import { messageHandler } from './message';

// * DEFINE COMMANDS HERE *
const commands: Command[] = [
  startCommand,
  randomWordCommand,
  removeWordCommand,
  setReminderCommand,
  setTimeFrameCommand,
  setIntervalCommand,
  setTimeZoneCommand,
  listTimeZonesHandler,
  helpCommand,
];

// Configure middleware, commands and callbacks
export function configureHandlers(bot: Telegraf) {
  bot.use(exceptionMiddleware);

  // Command handlers should be defined before the message handler,
  // otherwise the message handler handles all commands
  for (const command of commands) {
    bot.command(command.name, (ctx: CommandCtx) => command.handle(ctx));
  }

  bot.on('message', (ctx) => messageHandler.handle(ctx));
  bot.on('callback_query', (ctx) => callbackHandler.handle(ctx));
}
