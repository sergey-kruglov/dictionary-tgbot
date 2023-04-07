import { CommandCtx } from 'src/common/types';
import { User } from 'src/models';

export async function startHandler(ctx: CommandCtx): Promise<void> {
  const { from, chat } = ctx.update.message;
  await User.updateOne(
    { id: from.id },
    {
      isBot: from.is_bot,
      firstName: from.first_name,
      lastName: from.last_name,
      language: from.language_code,
      chatId: chat.id,
    },
    { upsert: true }
  );

  const name = from.first_name || from.username || from.id;

  await ctx.reply(`Welcome, ${name}. Write /help to get more info`);
}
