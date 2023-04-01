import { CommandCtx } from 'src/common/types';
import { helpText } from 'src/lib/help';
import { User } from 'src/models';

export async function startHandler(ctx: CommandCtx): Promise<void> {
  const from = ctx.update.message.from;
  await User.updateOne(
    {
      id: from.id,
    },
    {
      isBot: from.is_bot,
      firstName: from.first_name,
      lastName: from.last_name,
      language: from.language_code,
    },
    { upsert: true }
  );

  const name = from.first_name || from.username || from.id;

  await ctx.reply(
    `Welcome, ${name}. Write a word to get a definition and pronunciation.`
  );
  await ctx.reply(helpText);
}
