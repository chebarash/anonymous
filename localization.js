const rules = {
  "No Hate Speech or Bullying": `Make sure everyone feels safe. Bullying of any kind isn't allowed, and degrading comments about race, religion, culture, sexual orientation, gender, or identity will not be tolerated.`,
  "No Spam": `Self-promotion, spam, and irrelevant links aren't allowed. This also includes flooding the channel with overly frequent or repetitive messages.`,
  "Content Standards": `No explicit content. This includes but is not limited to graphic violence, adult content, and gore. Such posts will be removed.`,
  "No Harassment": `Sending threats or harassment to others or advocating for violence against others in any form will result in immediate removal and a possible ban.`,
};

const tips = {
  "Reply to message": ` If you want to reply to someone from the channel, you can simply select "reply in another chat" then select me and reply to him.`,
  "Open source": `This bot is completely anonymous and you can verify by opening the <a href="https://github.com/chebarash/anonymous">source code</a>.`,
  Support: `If you still have questions or suggestions, just contact <a href="http://t.me/chbrsh">my developer</a>.`,
};

const toList = (obj) =>
  Object.entries(obj)
    .map(([title, text], i) => `<b>${i + 1}. <u>${title}:</u></b> ${text}`)
    .join(`\n\n`);

module.exports = {
  start: `The bot sends your messages completely anonymously to @puanonymous immediately.\n\nHowever, as soon as you break the /rules, you may be blocked and your messages will be sent after the admin’s approval.\n\nMoreover, there are several /tips to make your user experience better.`,
  rules: `<b>Very important rules:</b>\n\n${toList(
    rules
  )}\n\nIf you see something that breaks the rules, report it. We rely on our community members to help keep this space clean and respectful.\n\nAnd also for security purposes, all links and marks are sent to the channel after confirmation by the admin.`,
  tips: `<b>A few tips to make your bot experience better:</b>\n\n${toList(
    tips
  )}`,
};
