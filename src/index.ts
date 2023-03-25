import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { appConfig } from './config';
import { Message, User } from './models';

const bot = new Telegraf(appConfig.telegram.token);

bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  await next().catch((err: Error) => {
    console.log(err.message);
    ctx
      .reply(err.message || 'There was an exception. Try again later.')
      .catch((e) => console.log(e));
  }); // runs next middleware
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
});

bot.start(async (ctx) => {
  const from = ctx.update.message.from;
  await User.create({
    id: from.id,
    isBot: from.is_bot,
    firstName: from.first_name,
    lastName: from.last_name,
    language: from.language_code,
  });

  const name = from.first_name || from.username || from.id;
  await ctx.reply(`Welcome, ${name}`);
});

bot.command('save', async (ctx) => {
  const { message_id, from, text } = ctx.update.message;
  const [, word, ...rest] = text.split(/\s/gi);
  if (!word || rest.length) {
    throw new Error('Incorrect command format. Example: /save word');
  }

  if (!word.match(/^[a-z]+$/gi)) {
    throw new Error('The word should contain only letters');
  }

  const user = await User.findOne({ id: from.id });
  const message = new Message({
    id: message_id,
    text: word,
    user,
  });
  await message.save();

  await ctx.reply(`Word ${word} was saved`);
});

bot.on(message('text'), async (ctx) => {
  await ctx.deleteMessage(ctx.update.message.message_id);
});

// Enable graceful stop
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  mongoose.disconnect().catch((err) => {
    throw err;
  });
});
process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  mongoose.disconnect().catch((err) => {
    throw err;
  });
});

async function run() {
  await mongoose.connect(appConfig.mongodb.uri);
  await bot.launch();
}

run().catch((err) => {
  throw err;
});
