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
bot.on(message(), (ctx) => ctx.copyMessage(parseInt(CHANNEL)));

(async () => {
  app.use(await bot.createWebhook({ domain: VERCEL_URL }));

  app.listen(PORT, () => console.log("Listening on port", PORT));
})();

module.exports = app;
