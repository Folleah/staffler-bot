const Telegraf = require('telegraf');

const bot = new Telegraf('764272037:AAHFt8QCbA9TxrwM0HV3ot_7BtpA8YaLJnY');
bot.start((ctx) => ctx.reply('This bot can not be used for personal interaction. Just add it to the chat and assign control to delete users.'));
bot.startWebhook('/Vg1rTdfeW6EhrCux06E3ZecyhmOoFImANvFzfuyr', null, 5000);

bot.on('message', (ctx) => {
  ctx.reply('test');
});

bot.launch();
