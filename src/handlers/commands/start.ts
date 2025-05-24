import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { User as TgUser } from "https://deno.land/x/grammy_types@v3.15.0/manage.ts";
import { logger } from "../../common/logger.ts";
import { Command } from "../../interfaces/handler.ts";
import { User } from "../../models/index.ts";

const welcomeText = `
Welcome to the English Vocabulary Bot - your personal language learning companion!

This bot is designed to help you effortlessly expand your English vocabulary. 
Whether you're a student, a professional, or simply a language enthusiast, 
our bot makes learning new words engaging and effective.

Use /help command to get more info.
`;

/**
 * Handle /start command.
 * Create a user or update existing one,
 * reply with Welcome message.
 */
class StartCommand implements Command {
  readonly name = "start";

  async handle(ctx: Context): Promise<void> {
    logger.log("start chat", { id: ctx.msgId });
    if (!ctx?.message) return;
    const { from, chat } = ctx.message;
    await this.createOrUpdateUser(from, chat.id);
    await ctx.reply(welcomeText);
    logger.log("chat started", { id: ctx.msgId, user: from.id });
  }

  private async createOrUpdateUser(
    from: TgUser,
    chatId: number
  ): Promise<void> {
    await User.updateOne(
      { id: from.id },
      {
        $set: {
          isBot: from.is_bot,
          firstName: from.first_name,
          lastName: from.last_name,
          language: from.language_code,
          chatId,
        },
      },
      { upsert: true }
    );
  }
}

export const startCommand = new StartCommand();
