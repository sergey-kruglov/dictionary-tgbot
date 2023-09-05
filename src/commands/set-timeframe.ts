import { CommandCtx } from '../common/types';
import { getCommandWordsOrFail, validateTimeOrFail } from '../common/utils';
import { Command } from '../interfaces/handler';
import { User } from '../models';

/**
 * Handle /setTimeFrame command.
 * Set time frame of repetition.
 * For example, we send notifications from 9:00 till 22:00.
 */
class SetTimeFrameCommand implements Command {
  readonly name = 'settimeframe';

  private readonly _usageExample = '/settimeframe 10:00-20:00';

  async handle(ctx: CommandCtx) {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const [startTime, endTime] = getCommandWordsOrFail(
      text,
      2,
      this._usageExample
    );

    validateTimeOrFail(startTime, this._usageExample);
    validateTimeOrFail(endTime, this._usageExample);

    await User.updateOne({ id: from.id }, { $set: { startTime, endTime } });
    await ctx.reply(`Your time frame is now: ${startTime}-${endTime}`);
  }
}

export const setTimeFrameCommand = new SetTimeFrameCommand();
