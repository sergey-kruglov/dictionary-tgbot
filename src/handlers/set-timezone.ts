import { CommandCtx } from 'src/common/types';
import { getCommandTextOrFail, validateIntOrFail } from 'src/common/utils';
import { Handler } from 'src/interfaces/handler';
import { User } from 'src/models';

class SetTimeZoneHandler implements Handler {
  async handle(ctx: CommandCtx): Promise<void> {
    if (!('text' in ctx.update.message)) {
      await ctx.deleteMessage(ctx.message.message_id);
      return;
    }

    const { from, text } = ctx.update.message;
    const timeZone = this.getTimeZone(text);
    await this.setUserTimeZone(ctx, from.id, timeZone);
  }

  private getTimeZone(text: string): number {
    const timezone = getCommandTextOrFail(text);
    validateIntOrFail(timezone);
    return parseInt(timezone);
  }

  private async setUserTimeZone(
    ctx: CommandCtx,
    id: number,
    timeZone: number
  ): Promise<void> {
    await User.updateOne({ id }, { $set: { timeZone } });
    await ctx.reply(`Your timezone is now: ${timeZone}`);
  }
}

export const setTimeZoneHandler = new SetTimeZoneHandler();
