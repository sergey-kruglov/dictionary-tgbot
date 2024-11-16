import { Bot } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { cancelCommand } from "../commands/cancel.ts";
import { helpCommand } from "../commands/help.ts";
import { listTimeZonesHandler } from "../commands/list-timezones.ts";
import { randomWordCommand } from "../commands/random-word.ts";
import { removeWordCommand } from "../commands/remove-word.ts";
import { setIntervalCommand } from "../commands/set-interval.ts";
import { setReminderCommand } from "../commands/set-reminder.ts";
import { setTimeFrameCommand } from "../commands/set-timeframe.ts";
import { setTimeZoneCommand } from "../commands/set-timezone.ts";
import { startCommand } from "../commands/start.ts";
import { Command } from "../interfaces/handler.ts";
import { exceptionMiddleware } from "../middleware/exception.ts";
import { callbackHandler } from "./callback.ts";
import { messageHandler } from "./message.ts";

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
  cancelCommand,
];

// Configure middleware, commands and callbacks
export function configureHandlers(bot: Bot) {
  bot.use(exceptionMiddleware);

  // Command handlers should be defined before the message handler,
  // otherwise the message handler handles all commands
  for (const command of commands) {
    bot.command(command.name, (ctx) => command.handle(ctx));
  }

  bot.on("message", (ctx) => messageHandler.handle(ctx));
  bot.on("callback_query", (ctx) => callbackHandler.handle(ctx));
}
