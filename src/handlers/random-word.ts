/* eslint-disable no-useless-escape */
import { CommandCtx } from '../common/types';
import { addWordReply } from '../common/utils';
import { Handler } from '../interfaces/handler';
import { Word } from '../models';
import { IWord } from '../models/word';

class RandomWordHandler implements Handler {
  async handle(ctx: CommandCtx): Promise<void> {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const [word]: IWord[] = await Word.aggregate([{ $sample: { size: 1 } }]);

    await this.reply(ctx, word);
  }

  private async reply(ctx: CommandCtx, word: IWord): Promise<void> {
    await addWordReply(ctx, word);
  }
}

export const randomWordHandler = new RandomWordHandler();
