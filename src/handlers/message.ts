import { MessageCtx } from 'src/common/types';
import { Errors } from 'src/lib/errors';
import { Word } from 'src/models';

export async function messageHandler(ctx: MessageCtx) {
  if (!('text' in ctx.update.message)) {
    await ctx.deleteMessage(ctx.message.message_id);
    return;
  }

  const { text } = ctx.update.message;
  const [word, ...rest] = text.split(/\s/gi);
  if (!word || rest.length) {
    throw new Error(Errors.INCORRECT_FORMAT);
  }

  if (!word.match(/^[a-z]+$/gi)) {
    throw new Error(Errors.ONLY_LETTERS_ALLOWED);
  }

  await Word.updateOne(
    { writing: word },
    { $inc: { requestedCount: 1 } },
    { upsert: true }
  );

  await ctx.reply(`Do you want to save the word?`, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Yes', callback_data: `yes:${word}` },
          { text: 'No', callback_data: `no:${word}` },
        ],
      ],
    },
  });
}
