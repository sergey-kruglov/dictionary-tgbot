import * as cron from 'node-cron';
import { Telegraf } from 'telegraf';
import { prepareMarkdown } from './common/utils';
import { User } from './models';
import { IWord } from './models/word';

export class Scheduler {
  public static start(bot: Telegraf): void {
    // every minute
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    cron.schedule('* * * * *', async () => {
      const usersCount = await User.count();
      console.log(`Send scheduled messages. Count: ${usersCount}`);

      let skip = 0;
      const limit = 100;

      for (let count = 0; count < usersCount; count += 100) {
        const users: { _id: string; chatId: number; word: IWord[] }[] =
          await User.aggregate([
            { $match: { nextReminderDate: { $lte: new Date() } } },
            { $sort: { _id: 1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                chatId: 1,
                word: {
                  $arrayElemAt: [
                    '$words',
                    { $floor: { $multiply: ['$wordsCount', Math.random()] } },
                  ],
                },
              },
            },
            {
              $lookup: {
                from: 'words',
                localField: 'word',
                foreignField: 'writing',
                as: 'word',
              },
            },
          ]);

        const messagePromises = [];
        for (const user of users) {
          const word = user.word?.[0];
          if (!word) {
            console.error('Word not found');
            return;
          }

          messagePromises.push(
            bot.telegram.sendMessage(user.chatId, prepareMarkdown(word), {
              parse_mode: 'MarkdownV2',
            })
          );
        }

        await Promise.all(messagePromises);
        skip += limit;
      }
    });
  }
}
