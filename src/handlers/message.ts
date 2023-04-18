/* eslint-disable no-useless-escape */
import axios from 'axios';
import { appConfig } from 'src/common/config';
import { MessageCtx } from 'src/common/types';
import {
  getWordOrFail,
  prepareMarkdown,
  validateWordOrFail,
} from 'src/common/utils';
import { Handler } from 'src/interfaces/handler';
import { RapidApiResponse, Result } from 'src/interfaces/rapid-api-response';
import { Errors } from 'src/lib/errors';
import { Settings, Word } from 'src/models';
import { IWord, IWordDefinition } from 'src/models/word';

class MessageHandler implements Handler {
  async handle(ctx: MessageCtx): Promise<void> {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { text } = ctx.update.message;
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

    const settings = await Settings.updateOne(
      { requestCount: { $lt: 2500 } }, // free tier is 2500 req/day
      { $inc: { requestCount: 1 } }
    );
    if (!settings.modifiedCount) {
      throw new Error(Errors.REQUEST_LIMIT_EXCEEDED);
    }
  }

  private async getWordFromApi(writing: string): Promise<RapidApiResponse> {
    const { data } = await axios
      .get<RapidApiResponse>(
        `https://wordsapiv1.p.rapidapi.com/words/${writing}`,
        { headers: { 'X-RapidAPI-Key': appConfig.rapidApiKey } }
      )
      .catch((err: Error) => {
        throw new Error(err.message || Errors.INTERNAL_SERVER_EXCEPTION);
      });

    return data;
  }

  private async createNewWord(
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

  private async reply(ctx: MessageCtx, word: IWord): Promise<void> {
    await ctx.replyWithMarkdownV2(prepareMarkdown(word));
    await ctx.reply(`Do you want to save the word?`, {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Yes', callback_data: `yes:${word.writing}` },
            { text: 'No', callback_data: 'no' },
          ],
        ],
      },
    });
  }
}

export const messageHandler = new MessageHandler();
