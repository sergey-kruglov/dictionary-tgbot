import { Bot } from "https://deno.land/x/grammy@v1.31.3/mod.ts";

import { logger } from "./common/logger.ts";
import { SendRemindersJob } from "./jobs/send-reminders.ts";

const EveryMinute = "* * * * *";

function addCronJob(
  name: string,
  schedule: string | Deno.CronSchedule,
  jobPromise: Promise<void>
) {
  Deno.cron(name, schedule, () => {
    jobPromise.catch((err: Error) => {
      logger.error(`cron error: ${name}`, { error: err });
    });
  });
}

export function initScheduler(bot: Bot) {
  addCronJob("send reminders", EveryMinute, SendRemindersJob.execute(bot));
}
