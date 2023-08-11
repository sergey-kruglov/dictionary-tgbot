import moment from 'moment-timezone';
import * as cron from 'node-cron';
import { Telegraf } from 'telegraf';
import { prepareMarkdown } from './common/utils';
import { AggregatedUser } from './interfaces/aggregated-user';
import { User } from './models';

export class Scheduler {
  public static start(bot: Telegraf): void {
    // every minute
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    cron.schedule('* * * * *', async () => {
      try {
        const date = new Date();
        const usersCount = await User.count({
          nextReminderDate: { $lte: date },
          words: { $ne: [] },
          reminderStatus: true,
        });
        console.log(`Send scheduled messages. Count: ${usersCount}`);

        let skip = 0;
        const limit = 500;

        for (let count = 0; count < usersCount; count += 500) {
          const users: AggregatedUser[] = await User.aggregate([
            {
              $match: {
                nextReminderDate: { $lte: date },
                words: { $ne: [] },
                reminderStatus: true,
              },
            },
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
                nextReminderDate: 1,
                reminderIntervalMinutes: 1,
                reminderStartTime: 1,
                reminderEndTime: 1,
                timeZone: 1,
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

            const [startHoursStr, startMinutesStr] =
              user.reminderStartTime.split(':');
            const startHours = Number(startHoursStr);
            const startMinutes = Number(startMinutesStr);

            const [endHoursStr, endMinutesStr] =
              user.reminderEndTime.split(':');
            const endHours = Number(endHoursStr);
            const endMinutes = Number(endMinutesStr);

            const nextReminderDate: moment.Moment =
              this.updateOutdatedDate(user);

            const startDate = moment
              .tz(user.timeZone)
              .set({ hours: startHours, minutes: startMinutes });
            const endDate = moment
              .tz(user.timeZone)
              .set({ hours: endHours, minutes: endMinutes });

            // send next day if not between time frame
            if (!nextReminderDate.isBetween(startDate, endDate)) {
              nextReminderDate.add(1, 'day').set({
                hours: startHours,
                minutes: startMinutes,
                seconds: 0,
                milliseconds: 0,
              });
            }

            const updatePromise = async () => {
              await bot.telegram.sendMessage(
                user.chatId,
                prepareMarkdown(word),
                {
                  parse_mode: 'MarkdownV2',
                }
              );
              await User.updateOne(
                { _id: user._id },
                { $set: { nextReminderDate: nextReminderDate.toDate() } }
              );
            };
            messagePromises.push(updatePromise());
          }

          await Promise.all(messagePromises);
          skip += limit;
        }
      } catch (err) {
        console.log(err);
      }
    });
  }

  static updateOutdatedDate(user: AggregatedUser): moment.Moment {
    const nextReminderDate = moment(user.nextReminderDate);
    const currentMoment = moment();

    while (nextReminderDate.isBefore(currentMoment, 'minutes')) {
      nextReminderDate.add(user.reminderIntervalMinutes, 'minutes');
    }

    return nextReminderDate.set({
      seconds: 0,
      milliseconds: 0,
    });
  }
}
