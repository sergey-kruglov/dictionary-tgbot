import { CommandCtx } from 'src/common/types';
import { Errors } from 'src/lib/errors';
import { User } from 'src/models';

export async function authHandler(ctx: CommandCtx): Promise<void> {
  const { from, text } = ctx.update.message;
  const [, token, ...rest] = text.split(/\s/gi);
  if (!token || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  await User.findOne(
    { id: from.id },
    {
      $set: {
        rapidApiKey: token,
      },
    }
  );

  await ctx.reply(`Your token has been saved`);
}
