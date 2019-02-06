const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');

const API_TOKEN = '764272037:AAHFt8QCbA9TxrwM0HV3ot_7BtpA8YaLJnY';
const PORT = process.env.PORT || 3000;
const URL = 'https://youdiedbot.herokuapp.com';
const EXPIRED_TIME = 60 * 10;
let joinedUsers = [];
let diedBots = [];

console.debug('App port: ' + PORT);

const bot = new Telegraf(API_TOKEN);
const telegram = new Telegram(API_TOKEN);
console.debug('Bot initiated.');
bot.start((ctx) => ctx.reply('This bot can not be used for personal interaction. Just add it to the chat and assign control to delete users and messages.'));

bot.on('new_chat_members', (ctx) => {
  userInfo = {
    chatId: ctx.message.chat.id,
    userId: ctx.message.from.id,
    timestamp: ctx.message.date,
  };
  console.debug('User join: ' + userInfo);
  joinedUsers.push(userInfo);
});

bot.on('message', (ctx) => {
  console.debug(typeof ctx.message.entities, ctx.message.entities === undefined, ctx.message.entities === null);
  if (!isWhois(ctx.message.text) && isUserJoinedRecently(ctx.message.from.id)) {
    if (ctx.message.entities !== null || ctx.message.photo !== null) {

      // telegram.kickChatMember(ctx.message.chat.id, ctx.message.from.id);
      // telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      // ctx.reply(`__Bot #${ctx.message.from.id} died.__`);
    }
  }
});
console.debug('Bot listening started');

setInterval(() => {
  let currentTimestamp = getCurrentTimestamp();
  joinedUsers = joinedUsers.filter(function (userInfo) {
    return (currentTimestamp - EXPIRED_TIME) > userInfo.timestamp;
  })
}, 5 * 1000);

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
console.debug('Webhook started');

getCurrentTimestamp = () => {
  return Math.round(+new Date()/1000);
};

isWhois = (message) => {
  return message.search('#whois') !== -1;
};

isUserJoinedRecently = (userId) => {
  joinedUsers.forEach(function(userInfo) {
    if (userInfo.userId === userId) {
      return true;
    }
  });

  return false;
};
