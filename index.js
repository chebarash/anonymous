require(`dotenv`).config();
const { Telegraf } = require(`telegraf`);
const { message } = require("telegraf/filters");
const express = require(`express`);

const { CHANNEL, TOKEN, VERCEL_URL, PORT } = process.env;

const bot = new Telegraf(TOKEN);
const app = express();

bot.use(async (_ctx, next) => {
  try {
    await next();
  } catch (e) {
    console.log(e);
  }
});

bot.start((ctx) =>
  ctx.reply(`Send completely anonymous gossip to @puanonymous`)
);

bot.help((ctx) =>
  ctx.reply(
    `<b>A few tips to make your bot experience better:</b>\n\n<b>1.</b> If you want to reply to someone from the channel, you can simply select <i>"reply in another chat"</i> then select me and reply to him.\n\n<b>2.</b> This bot is completely anonymous and you can verify by opening the <a href="https://github.com/chebarash/anonymous">source code</a>.\n\n<b>3.</b> If you still have questions or suggestions, just contact <a href="http://t.me/chbrsh">my developer</a>.`,
    { parse_mode: `HTML` }
  )
);

bot.on(message(), (ctx) => ctx.copyMessage(parseInt(CHANNEL)));

(async () => {
  app.use(await bot.createWebhook({ domain: VERCEL_URL }));

  app.listen(PORT, () => console.log("Listening on port", PORT));
})();

module.exports = app;
