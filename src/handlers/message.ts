import { MessageCtx } from 'src/common/types';
import { Errors } from 'src/lib/errors';
import { Message, User } from 'src/models';

export async function messageHandler(ctx: MessageCtx) {
  if (!('text' in ctx.update.message)) {
    await ctx.deleteMessage(ctx.message.message_id);
    return;
  }

  const { message_id, from, text } = ctx.update.message;
  const [word, ...rest] = text.split(/\s/gi);
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

  await ctx.reply(`Do you want to save the word?`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Yes', callback_data: `yes:${message_id}` },
          { text: 'No', callback_data: `no:${message_id}` },
        ],
      ],
    },
  });
}
