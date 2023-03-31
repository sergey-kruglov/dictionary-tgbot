import { CommandCtx } from 'src/common/types';
import { Errors } from 'src/lib/errors';
import { Message, User } from 'src/models';

export async function saveHandler(ctx: CommandCtx): Promise<void> {
  const { message_id, from, text } = ctx.update.message;
  const [, word, ...rest] = text.split(/\s/gi);
  if (!word || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  if (!word.match(/^[a-z]+$/gi)) {
    throw new Error(Errors.ONLY_LETTERS_ALLOWED);
  }

  const user = await User.findOne({ id: from.id });
  const message = new Message({
    id: message_id,
    text: word,
    user,
  });
  await message.save();

  await ctx.reply(`Word ${word} was saved`);
}
