import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { InlineQueryResult } from 'typegram';
import { appConfig } from './config';

const bot = new Telegraf(appConfig.telegram.token);

bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  await next(); // runs next middleware
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
});

bot.start(async (ctx) => {
  await ctx.reply('Welcome');
});

bot.help((ctx) => ctx.reply('There is no help!'));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.command('save', async (ctx) => {
  await ctx.reply('started');
});

bot.command('quit', async (ctx) => {
  await ctx.leaveChat();
});

bot.on(message('text'), async (ctx) => {
  await ctx.reply(`Hello ${ctx.state.role as string}`);
});

bot.on('callback_query', async (ctx) => {
  await ctx.answerCbQuery();
});

bot.on('inline_query', async (ctx) => {
  const result: InlineQueryResult[] = [];
  await ctx.answerInlineQuery(result);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

async function run() {
  await mongoose.connect(appConfig.mongodb.uri);
  await bot.launch();
}

run().catch((err) => {
  throw err;
});
