const Telegraf = require('telegraf');

const API_TOKEN = '764272037:AAHFt8QCbA9TxrwM0HV3ot_7BtpA8YaLJnY';
const PORT = process.env.PORT || 3000;
const URL = 'https://youdiedbot.herokuapp.com';
let temp = 0;

console.debug('App port: ' + PORT);

const bot = new Telegraf(API_TOKEN);
console.debug('Bot initiated.');
bot.start((ctx) => ctx.reply('This bot can not be used for personal interaction. Just add it to the chat and assign control to delete users.'));
bot.on('message', (ctx) => {
  console.log(ctx.message);
});
console.debug('Bot listening started');

setInterval(() => {
  temp++;
  console.log('10 sec handled: ' + temp);
}, 10 * 1000);

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
console.debug('Webhook started');
