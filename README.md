# PU Anonymous

The bot sends your messages completely anonymously to [channel](http://t.me/puanonymous) immediately.

However, as soon as you break the rules, you may be blocked and your messages will be sent after the admin’s approval.

Moreover, there are several tips to make your user experience better.

## Very important rules

1. **No Hate Speech or Bullying:** Make sure everyone feels safe. Bullying of any kind isn't allowed, and degrading comments about race, religion, culture, sexual orientation, gender, or identity will not be tolerated.

1. **No Spam:** Self-promotion, spam, and irrelevant links aren't allowed. This also includes flooding the channel with overly frequent or repetitive messages.

1. **Content Standards:** No explicit content. This includes but is not limited to graphic violence, adult content, and gore. Such posts will be removed.

1. **No Harassment:** Sending threats or harassment to others or advocating for violence against others in any form will result in immediate removal and a possible ban.

If you see something that breaks the rules, report it. We rely on our community members to help keep this space clean and respectful.

And also for security purposes, all links and mentions are sent to the channel after confirmation by the admin.

## A few tips to make your bot experience better

1. **Reply to message:**  If you want to reply to someone from the channel, you can simply select "reply in another chat" then select me and reply to him.

1. **Support:** If you still have questions or suggestions, just contact [my developer](http://t.me/chbrsh).

## Getting Started

To get a local copy up and running follow these simple example steps.

### Fork

1. [Fork](https://github.com/chebarash/anonymous/fork) this repo.

1. Make your changes.

### Vercel

1. Create a [new project in Vercel](https://vercel.com/new) and import the code from the repository you recently forked.

1. Connect MongoDB to project. Check out [this tutorial](https://www.mongodb.com/developer/products/atlas/how-to-connect-mongodb-atlas-to-vercel-using-the-new-integration/) to get started or for more information, take a look at the [integration documentation](https://www.mongodb.com/docs/atlas/reference/partner-integrations/vercel/).

1. Setup environment following variables.
   ```env
   CHANNEL=<channel id>
   TOKEN=<bot token>
   ADMIN_ID=<admin id>
   PORT=3000
   ```
