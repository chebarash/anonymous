require(`dotenv`).config();
const { Telegraf, Context } = require(`telegraf`);
const { message } = require("telegraf/filters");
const express = require(`express`);
const { MongoClient } = require("mongodb");
const {
  start,
  rules,
  tips,
  del,
  send,
  unblock,
  block,
  cancel,
  toAdmin,
  toChannel,
  isBlocked,
  isUnblocked,
} = require("./localization");

const { CHANNEL, ADMIN_ID, TOKEN, VERCEL_URL, PORT, MONGODB_URI } = process.env;

const forbidden = [`url`, `text_link`, `mention`];

class MyContext extends Context {
  constructor(update, telegram, options) {
    super(update, telegram, options);
  }

  updKb(index, bt) {
    const { inline_keyboard } = this.callbackQuery.message.reply_markup;
    inline_keyboard[0][index] = bt;
    return this.editMessageReplyMarkup({ inline_keyboard });
  }

  getId() {
    return this.callbackQuery.data.split(`//`)[1];
  }
}

const bot = new Telegraf(TOKEN, { contextType: MyContext });
const app = express();

const channel = parseInt(CHANNEL);
const adminId = parseInt(ADMIN_ID);

const client = new MongoClient(MONGODB_URI);
const database = client.db("anonymous");
const blocked = database.collection("blocked");

const btMsg = (msgId) => ({
  text: msgId ? del : send,
  callback_data: `${msgId ? `delete//${msgId}` : `send`}`,
});
const btAct = (isBlocked, id) => ({
  text: isBlocked ? unblock : block,
  callback_data: `${isBlocked ? `unblock` : `block`}//${id}`,
});

const sendAdmin = async (msg) => {
  try {
    await bot.telegram.sendMessage(
      adminId,
      `<pre><code class="language-json">${JSON.stringify(
        msg,
        null,
        2
      )}</code></pre>`,
      { parse_mode: `HTML` }
    );
  } catch (e) {
    console.log(e);
  }
};

bot.use(async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    sendAdmin({ message: e.message, ...e, update: ctx.update });
  }
});

bot.start((ctx) => ctx.reply(start));
bot.command(`rules`, (ctx) => ctx.reply(rules, { parse_mode: `HTML` }));
bot.command(`tips`, (ctx) => ctx.reply(tips, { parse_mode: `HTML` }));
bot.command(`anon`, async (ctx) => {
  const {
    text,
    reply_to_message: { message_id },
  } = ctx.message;
  await ctx.reply(text.replace(`/anon `, ``), {
    reply_to_message_id: message_id,
  });
  await ctx.deleteMessage();
});

bot.on(message(), async (ctx) => {
  if (ctx.chat.type != "private") return;
  const {
    from: { id },
    message: { entities, caption_entities },
  } = ctx;

  const isBlocked = await blocked.findOne({ id: `${id}` });
  const isUrl = (entities || caption_entities)?.find(({ type }) =>
    forbidden.includes(type)
  );

  const msgId =
    isBlocked || isUrl
      ? undefined
      : (await ctx.copyMessage(channel)).message_id;

  await ctx.copyMessage(adminId, {
    reply_markup: {
      inline_keyboard: [
        [
          btMsg(msgId),
          btAct(isBlocked, id),
          { text: cancel, callback_data: `cancel` },
        ],
      ],
    },
  });

  await ctx.reply(isBlocked || isUrl ? toAdmin : toChannel);
});

bot.action(`send`, async (ctx) => {
  const { message_id } = await ctx.copyMessage(channel);
  return await ctx.updKb(0, btMsg(message_id));
});

bot.action(/^delete/g, async (ctx) => {
  await bot.telegram.deleteMessage(channel, ctx.getId());
  return await ctx.updKb(0, btMsg());
});

bot.action(/^block/g, async (ctx) => {
  const id = ctx.getId();
  await blocked.insertOne({ id });
  await bot.telegram.sendMessage(id, isBlocked);
  return await ctx.updKb(1, btAct(true, id));
});

bot.action(/^unblock/g, async (ctx) => {
  const id = ctx.getId();
  await blocked.deleteMany({ id });
  await bot.telegram.sendMessage(id, isUnblocked);
  return await ctx.updKb(1, btAct(false, id));
});

bot.action(`cancel`, async (ctx) => await ctx.deleteMessage());

(async () => {
  app.use(await bot.createWebhook({ domain: VERCEL_URL }));
  app.listen(PORT, () => sendAdmin({ "Listening on port": PORT }));
})();

module.exports = app;
