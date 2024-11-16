import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { User as TgUser } from "https://deno.land/x/grammy_types@v3.15.0/manage.ts";
import { Command } from "../interfaces/handler.ts";
import { User } from "../models/index.ts";

/**
 * Handle /start command.
 * Create a user or update existing one,
 * reply with Welcome message.
 */
class StartCommand implements Command {
  readonly name = "start";

  async handle(ctx: Context): Promise<void> {
    if (!ctx?.message) return;
    const { from, chat } = ctx.message;
    await this.createOrUpdateUser(from, chat.id);
    await this.reply(ctx, from);
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

  private async reply(ctx: Context, from: TgUser): Promise<void> {
    const name = from.first_name || from.username || from.id;
    await ctx.reply(`Welcome, ${name}. Write /help to get more info`);
  }
}

export const startCommand = new StartCommand();
