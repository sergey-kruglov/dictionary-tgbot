/* eslint-disable no-useless-escape */
import { Context } from "https://deno.land/x/grammy@v1.31.3/mod.ts";
import axios from "npm:axios@1.7.7";
import { appConfig } from "../common/config.ts";
import {
  addWordReply,
  getWordOrFail,
  throwError,
  validateWordOrFail,
} from "../common/utils.ts";
import { RapidApiResponse, Result } from "../interfaces/rapid-api-response.ts";
import { Actions } from "../lib/actions.ts";
import { Errors } from "../lib/errors.ts";
import { Settings, User, Word } from "../models/index.ts";
import { IWord, IWordDefinition } from "../models/word.ts";

class MessageHandler {
  async handle(ctx: Context): Promise<void> {
    console.log("message");
    if (!ctx.message) return;
    if (!ctx?.message?.text) {
      await ctx.api.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.message;

    const activeCommand = await this.getActiveCommand(from.id);
    if (activeCommand) {
      // TODO handle active command
      return;
    }

    const writing = getWordOrFail(text);
    validateWordOrFail(writing);

    const word = await this.findWordInDB(writing);
    if (word) {
      await this.reply(ctx, word);
      return;
    }

    await this.checkRequestCount();
    const data = await this.getWordFromApi(writing);
    const newWord = await this.createNewWord(writing, data);
    await this.reply(ctx, newWord);
  }

  async getActiveCommand(userId: number): Promise<Actions | undefined> {
    const user = await User.findOne({ id: userId });
    return user?.activeCommand;
  }

  private async findWordInDB(writing: string): Promise<IWord | null> {
    const word = await Word.findOneAndUpdate(
      { writing },
      { $inc: { requestedCount: 1 } }
    );

    return word;
  }

  private async checkRequestCount(): Promise<void> {
    const secondsInOneDay = 86400;
    const nextDay = new Date().getTime() + secondsInOneDay * 1000;
    await Settings.updateOne(
      { counterResetDate: { $lt: new Date() } },
      { $set: { counterResetDate: new Date(nextDay), requestCount: 0 } }
    );

    const { modifiedCount } = await Settings.updateOne(
      // API free tier is 2500 req/day
      { requestCount: { $lt: 2500 } },
      { $inc: { requestCount: 1 } }
    );
    if (!modifiedCount) {
      throwError(Errors.REQUEST_LIMIT_EXCEEDED);
    }
  }

  private async getWordFromApi(writing: string): Promise<RapidApiResponse> {
    const { data } = await axios
      .get<RapidApiResponse>(
        `https://wordsapiv1.p.rapidapi.com/words/${writing}`,
        { headers: { "X-RapidAPI-Key": appConfig.rapidApiKey } }
      )
      .catch((err: Error) => {
        throw new Error(err.message || Errors.INTERNAL_SERVER_EXCEPTION);
      });

    return data;
  }

  private createNewWord(
    writing: string,
    data: RapidApiResponse
  ): Promise<IWord> {
    return Word.create({
      writing,
      definitions: data.results.map(
        (r: Result) =>
          ({
            definition: r.definition,
            partOfSpeech: r.partOfSpeech,
            synonyms: r.synonyms,
            examples: r.examples,
          } as IWordDefinition)
      ),
      pronunciation: data.pronunciation.all,
      requestedCount: 1,
      savedCount: 0,
    });
  }

  private async reply(ctx: Context, word: IWord): Promise<void> {
    await addWordReply(ctx, word);
  }
}

export const messageHandler = new MessageHandler();
