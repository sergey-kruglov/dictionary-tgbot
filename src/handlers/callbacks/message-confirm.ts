import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import { logger } from "../../common/logger.ts";
import { skip } from "../../common/utils.ts";
import { Callback } from "../../interfaces/handler.ts";
import { Actions } from "../../lib/actions.ts";
import { User, Word } from "../../models/index.ts";

/**
 * Handle "Save word?" button clicks
 */
class MessageConfirmCallback implements Callback {
  async handle(ctx: Context): Promise<void> {
    logger.log("message confirm", {
      id: ctx.msgId,
      user: ctx.callbackQuery?.from.id,
      data: ctx.callbackQuery?.data,
    });

    if (!ctx.callbackQuery) return skip(ctx.msgId);
    const { data, message, from } = ctx.callbackQuery;
    if (!data) return skip(ctx.msgId);

    const messageId = message?.message_id;
    if (!messageId) return skip(ctx.msgId);

    const [action, value] = data.split(";");
    if (action !== Actions.addWord && action !== Actions.removeWord) {
      await ctx.deleteMessage();
      return skip(ctx.msgId);
    }

    const [key, writing] = value.split(":");
    if (!messageId || key === "no") {
      await ctx.deleteMessage();
      return skip(ctx.msgId);
    }

    const exists = await this.isWordAlreadyExists(from.id, writing);
    if (action === Actions.addWord) {
      if (!exists) await this.addUserWord(from.id, writing);
    } else {
      if (exists) await this.removeUserWord(from.id, writing);
    }

    await ctx.deleteMessage();
    logger.log("message processed", { id: ctx.msgId });
  }

  async isWordAlreadyExists(id: number, writing: string): Promise<boolean> {
    const user = await User.findOne({
      id,
      words: writing,
    })
      .select("id")
      .lean();
    return !!user;
  }

  async addUserWord(id: number, writing: string): Promise<void> {
    const { matchedCount } = await User.updateOne(
      {
        id: id,
        words: { $nin: [writing] },
      },
      { $addToSet: { words: writing }, $inc: { wordsCount: 1 } }
    );

    console.log(matchedCount);

    if (matchedCount) {
      await this.updateWordStatistics(writing, true);
    }
  }

  async removeUserWord(id: number, writing: string): Promise<void> {
    const { matchedCount } = await User.updateOne(
      {
        id: id,
        words: writing,
      },
      { $pull: { words: writing }, $inc: { wordsCount: -1 } }
    );

    if (matchedCount) {
      await this.updateWordStatistics(writing, false);
    }
  }

  async updateWordStatistics(writing: string, increase: boolean) {
    await Word.updateOne(
      { writing },
      { $inc: { savedCount: increase ? 1 : -1 } }
    );
  }
}

export const messageConfirmCallback = new MessageConfirmCallback();
