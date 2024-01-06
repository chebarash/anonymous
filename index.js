require(`dotenv`).config();
const { Telegraf } = require(`telegraf`);
const { message } = require("telegraf/filters");
const express = require(`express`);
const { MongoClient } = require("mongodb");
const { start, rules, tips } = require("./localization");

const { CHANNEL, ADMIN_ID, TOKEN, VERCEL_URL, PORT, MONGODB_URI } = process.env;

const forbidden = [`url`, `text_link`, `mention`];

const bot = new Telegraf(TOKEN);
const app = express();

const channel = parseInt(CHANNEL);
const adminId = parseInt(ADMIN_ID);

const client = new MongoClient(MONGODB_URI);
const database = client.db("anonymous");
const blocked = database.collection("blocked");

bot.use(async (_ctx, next) => {
  try {
    await next();
  } catch (e) {
    const error = JSON.stringify(e, null, 2);
    await bot.telegram.sendMessage(
      adminId,
      `<pre><code class="language-json">${error}</code></pre>`,
      { parse_mode: `HTML` }
    );
  }
});

bot.start((ctx) => ctx.reply(start));
bot.command(`rules`, (ctx) => ctx.reply(rules, { parse_mode: `HTML` }));
bot.command(`tips`, (ctx) => ctx.reply(tips, { parse_mode: `HTML` }));

bot.on(message(), async (ctx) => {
  const {
    from: { id },
    message: { entities, caption_entities },
  } = ctx;

  const isBlocked = await blocked.findOne({ id: `${id}` });
  const isUrl = (entities || caption_entities)?.find(({ type }) =>
    forbidden.includes(type)
  );

  await ctx.copyMessage(adminId, {
    reply_markup: {
      inline_keyboard: [
        [
          isBlocked || isUrl
            ? { text: `send`, callback_data: `send` }
            : {
                text: `block`,
                callback_data: `block//${id}//${
                  (
                    await ctx.copyMessage(channel)
                  ).message_id
                }`,
              },
        ],
      ],
    },
  });
});

bot.action(`send`, async (ctx) => {
  await ctx.copyMessage(channel);
  return await ctx.deleteMessage();
});

bot.action(/^block/g, async (ctx) => {
  const [_, id, msg] = ctx.callbackQuery.data.split(`//`);
  await blocked.insertOne({ id });
  await bot.telegram.deleteMessage(channel, msg);
  return await ctx.editMessageReplyMarkup({
    inline_keyboard: [[{ text: `send`, callback_data: `send` }]],
  });
});

(async () => {
  app.use(await bot.createWebhook({ domain: VERCEL_URL }));
  app.listen(PORT, () => console.log("Listening on port", PORT));
})();

module.exports = app;
