const Telegraf = require('telegraf');

const bot = new Telegraf('764272037:AAHFt8QCbA9TxrwM0HV3ot_7BtpA8YaLJnY');
console.debug('Bot initiated.');
//bot.start((ctx) => ctx.reply('This bot can not be used for personal interaction. Just add it to the chat and assign control to delete users.'));
bot.startWebhook('/Vg1rTdfeW6EhrCux06E3ZecyhmOoFImANvFzfuyr', null, 5000);
console.debug('Webhook started');

bot.on('message', (ctx) => {
  ctx.reply('test');
});
console.debug('Bot listening started');

bot.launch();
console.debug('Bot launched');
