/* eslint-disable no-useless-escape */
import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { addWordReply } from "../common/utils.ts";
import { Command } from "../interfaces/handler.ts";
import { Word } from "../models/index.ts";
import { IWord } from "../models/word.ts";

/**
 * This command is temporarily disabled,
 * sine the database is not big enough at this moment
 */
class RandomWordCommand implements Command {
  readonly name = "randomword";

  async handle(ctx: Context): Promise<void> {
    if (!ctx.message) return;
    if (!ctx.message.text) {
      await ctx.deleteMessage();
      return;
    }

    const [word]: IWord[] = await Word.aggregate([{ $sample: { size: 1 } }]);

    await this.reply(ctx, word);
  }

  private async reply(ctx: Context, word: IWord): Promise<void> {
    await addWordReply(ctx, word);
  }
}

export const randomWordCommand = new RandomWordCommand();
