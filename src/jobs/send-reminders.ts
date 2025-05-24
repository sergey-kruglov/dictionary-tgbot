import { Bot } from "https://deno.land/x/grammy@v1.31.3/bot.ts";
import moment from "npm:moment";
import { logger } from "../common/logger.ts";
import { prepareMarkdown } from "../common/utils.ts";
import { AggregatedUser } from "../interfaces/aggregated-user.ts";
import { User } from "../models/user.ts";
import { IWord } from "../models/word.ts";

export class SendRemindersJob {
  static async execute(bot: Bot): Promise<void> {
    logger.log("Send scheduled messages");

    const date = new Date();
    let sentCount = 0;
    let lastProcessedUser: string | undefined;

    while (true) {
      const users: AggregatedUser[] = await this.getUsers(
        date,
        lastProcessedUser
      );
      logger.log(`process users: ${users.length}`);
      await this.processUsers(bot, users);

      const lastUser = users[users.length - 1];
      if (!lastUser) break;

      sentCount += users.length;
      lastProcessedUser = lastUser._id;
    }

    logger.log(`Scheduled messages sent: ${sentCount}`);
  }

  private static getUsers(
    date: Date,
    lastProcessedUser?: string
  ): Promise<AggregatedUser[]> {
    const match = lastProcessedUser
      ? {
          $match: {
            _id: { $gt: lastProcessedUser },
            nextReminderDate: { $lte: date },
            words: { $gte: 0 },
            reminderStatus: true,
          },
        }
      : {
          $match: {
            nextReminderDate: { $lte: date },
            words: { $gte: 0 },
            reminderStatus: true,
          },
        };
    return User.aggregate([
      match,
      { $sort: { _id: 1 } },
      { $limit: 500 },
      {
        $project: {
          chatId: 1,
          word: {
            $arrayElemAt: [
              "$words",
              { $floor: { $multiply: ["$wordsCount", Math.random()] } },
            ],
          },
          nextReminderDate: 1,
          reminderIntervalMinutes: 1,
          reminderStartTime: 1,
          reminderEndTime: 1,
        },
      },
      {
        $lookup: {
          from: "words",
          localField: "word",
          foreignField: "writing",
          as: "word",
        },
      },
    ]);
  }

  private static async processUsers(
    bot: Bot,
    users: AggregatedUser[]
  ): Promise<void> {
    const promises = [];
    for (const user of users) {
      const word = user.word?.[0];
      if (!word) {
        logger.error("word now found", { user: user._id });
        continue;
      }
      promises.push(this.updateUser(bot, user, word));
    }
    await Promise.allSettled(promises);
  }

  private static async updateUser(
    bot: Bot,
    user: AggregatedUser,
    word: IWord
  ): Promise<void> {
    const [startHoursStr, startMinutesStr] = user.reminderStartTime.split(":");
    const startHours = Number(startHoursStr);
    const startMinutes = Number(startMinutesStr);

    const [endHoursStr, endMinutesStr] = user.reminderEndTime.split(":");
    const endHours = Number(endHoursStr);
    const endMinutes = Number(endMinutesStr);

    const nextReminderDate: moment.Moment = this.updateOutdatedDate(user);

    const startDate = moment().set({
      hours: startHours,
      minutes: startMinutes,
    });
    const endDate = moment().set({ hours: endHours, minutes: endMinutes });

    // send next day if not between time frame
    if (!nextReminderDate.isBetween(startDate, endDate)) {
      nextReminderDate.add(1, "day").set({
        hours: startHours,
        minutes: startMinutes,
        seconds: 0,
        milliseconds: 0,
      });
    }

    try {
      await bot.api.sendMessage(user.chatId, prepareMarkdown(word), {
        parse_mode: "MarkdownV2",
      });
      await User.updateOne(
        { _id: user._id },
        { $set: { nextReminderDate: nextReminderDate.toDate() } }
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("send scheduled message error", {
          message: error.message,
          user: user._id,
        });
      } else {
        logger.error("send scheduled message error", { error, user: user._id });
      }
    }
  }

  private static updateOutdatedDate(user: AggregatedUser): moment.Moment {
    const nextReminderDate = moment(user.nextReminderDate);
    const currentMoment = moment();

    while (nextReminderDate.isBefore(currentMoment, "minutes")) {
      nextReminderDate.add(user.reminderIntervalMinutes, "minutes");
    }

    return nextReminderDate.set({
      seconds: 0,
      milliseconds: 0,
    });
  }
}
