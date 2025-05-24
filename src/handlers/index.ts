import { Bot } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { Command } from "../interfaces/handler.ts";
import { exceptionMiddleware } from "../middleware/exception.ts";
import { callbackHandler } from "./callback.ts";
import { cancelCommand } from "./commands/cancel.ts";
import { helpCommand } from "./commands/help.ts";
import { setIntervalCommand } from "./commands/set-interval.ts";
import { setReminderCommand } from "./commands/set-reminder.ts";
import { setTimeFrameCommand } from "./commands/set-timeframe.ts";
import { startCommand } from "./commands/start.ts";
import { messageHandler } from "./message.ts";

// * DEFINE COMMANDS HERE *
const commands: Command[] = [
  startCommand,
  // randomWordCommand,
  setReminderCommand,
  setTimeFrameCommand,
  setIntervalCommand,
  helpCommand,
  cancelCommand,
];

// Configure middleware, commands and callbacks
export function initHandlers(bot: Bot) {
  bot.use(exceptionMiddleware);

  // Command handlers should be defined before the message handler,
  // otherwise the message handler handles all commands
  for (const command of commands) {
    bot.command(command.name, (ctx) => command.handle(ctx));
  }

  bot.on("message", (ctx) => messageHandler.handle(ctx));
  bot.on("callback_query", (ctx) => callbackHandler.handle(ctx));
}
