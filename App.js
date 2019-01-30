const Telegraf = require('telegraf');

const bot = new Telegraf('581665381:AAEUAFKyV-Es3H-n2kkxxaaGMN1W7CB7fz4');
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));
bot.launch();
