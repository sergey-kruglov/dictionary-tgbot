import mongoose from 'mongoose';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import { appConfig } from './config';
import { Message, User } from './models';

const bot = new Telegraf(appConfig.telegram.token);

bot.use(async (ctx, next) => {
  console.time(`Processing update ${ctx.update.update_id}`);
  await next(); // runs next middleware
  // runs after next middleware finishes
  console.timeEnd(`Processing update ${ctx.update.update_id}`);
});

bot.start(async (ctx) => {
  try {
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
  } catch {
    await ctx.reply('There was an exception. Try to start again later.');
  }
});

bot.help((ctx) => ctx.reply('There is no help!'));

bot.command('save', async (ctx) => {
  const { message_id, from, text } = ctx.update.message;
  const [, word, ...rest] = text.split(/\s/gi);
  if (!word || rest.length) {
    await ctx.reply('Incorrect command format. Example: /save word');
    return;
  }

  if (!word.match(/^[a-z]+$/gi)) {
    await ctx.reply('The word should contain only letters');
    return;
  }

  try {
    const user = await User.findOne({ id: from.id });
    const message = new Message({
      id: message_id,
      text: word,
      user,
    });
    await message.save();
    await ctx.reply(`Word ${word} was saved`);
  } catch (err) {
    await ctx.reply('There was an exception. Try to repeat later.');
  }
});

bot.command('quit', async (ctx) => {
  await ctx.leaveChat();
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
