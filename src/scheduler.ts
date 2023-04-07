import * as cron from 'node-cron';

export class Scheduler {
  public static start(): void {
    // every minute
    cron.schedule('* * * * *', () => {
      console.log('job');
    });
  }
}
