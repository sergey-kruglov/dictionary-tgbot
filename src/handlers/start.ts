import { User as TgUser } from 'telegraf/typings/core/types/typegram';
import { CommandCtx } from '../common/types';
import { Handler } from '../interfaces/handler';
import { User } from '../models';

/**
 * Handle /start command.
 * Create a user or update existing one,
 * reply with Welcome message.
 */
class StartHandler implements Handler {
  async handle(ctx: CommandCtx): Promise<void> {
    const { from, chat } = ctx.update.message;
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

  // Reply with Welcome message
  private async reply(ctx: CommandCtx, from: TgUser): Promise<void> {
    const name = from.first_name || from.username || from.id;
    await ctx.reply(`Welcome, ${name}. Write /help to get more info`);
  }
}

export const startHandler = new StartHandler();
