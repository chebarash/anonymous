require(`dotenv`).config();
const { Telegraf } = require(`telegraf`);
const { message } = require("telegraf/filters");
const express = require(`express`);
const { MongoClient } = require("mongodb");

const { CHANNEL, ADMIN_ID, TOKEN, VERCEL_URL, PORT, MONGODB_URI } = process.env;

const bot = new Telegraf(TOKEN);
const app = express();
const channel = parseInt(CHANNEL);

const client = new MongoClient(MONGODB_URI);
const database = client.db("anonymous");
const blocked = database.collection("blocked");

bot.use(async (_ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
});

bot.start((ctx) =>
  ctx.reply(`Send completely anonymous messages to @puanonymous`)
);

bot.help((ctx) =>
  ctx.reply(
    `<b>A few tips to make your bot experience better:</b>\n\n<b>1.</b> If you want to reply to someone from the channel, you can simply select <i>"reply in another chat"</i> then select me and reply to him.\n\n<b>2.</b> This bot is completely anonymous and you can verify by opening the <a href="https://github.com/chebarash/anonymous">source code</a>.\n\n<b>3.</b> If you still have questions or suggestions, just contact <a href="http://t.me/chbrsh">my developer</a>.`,
    { parse_mode: `HTML` }
  )
);

bot.on(message(), async (ctx) => {
  const { id } = ctx.from;
  const isBlocked = await blocked.findOne({ id });
  await ctx.copyMessage(parseInt(ADMIN_ID), {
    reply_markup: {
      inline_keyboard: [
        [
          isBlocked
            ? {
                text: `send`,
                callback_data: `send`,
              }
            : {
                text: `block`,
                callback_data: `block//${id}//${
                  (
                    await ctx.copyMessage(parseInt(CHANNEL))
                  ).message_id
                }`,
              },
        ],
      ],
    },
  });
  return;
});

bot.action(`send`, async (ctx) => {
  await ctx.copyMessage(channel);
  return await ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [ctx.callbackQuery.message.reply_markup.inline_keyboard[0][0]],
    ],
  });
});

bot.action(/^block/g, async (ctx) => {
  const [_, id, msg] = ctx.callbackQuery.data.split(`//`);
  ctx.callbackQuery.message.reply_markup.inline_keyboard[0][1] = {
    text: `send`,
    callback_data: `send`,
  };
  await blocked.insertOne({ id });
  await bot.telegram.deleteMessage(channel, msg);
  return await ctx.editMessageReplyMarkup(
    ctx.callbackQuery.message.reply_markup
  );
});

(async () => {
  app.use(await bot.createWebhook({ domain: VERCEL_URL }));
  app.listen(PORT, () => console.log("Listening on port", PORT));
})();

module.exports = app;
