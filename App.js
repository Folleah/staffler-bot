const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');

const API_TOKEN = '764272037:AAHFt8QCbA9TxrwM0HV3ot_7BtpA8YaLJnY';
const PORT = process.env.PORT || 3000;
const URL = 'https://youdiedbot.herokuapp.com';
const EXPIRED_TIME = 60 * 10;
let joinedUsers = [];

console.debug('App port: ' + PORT);

const bot = new Telegraf(API_TOKEN);
const telegram = new Telegram(API_TOKEN);
console.debug('Bot initiated.');
bot.start((ctx) => ctx.reply('This bot can not be used for personal interaction. Just add it to the chat and assign control to delete users and messages.'));

bot.on('new_chat_members', (ctx) => {
  console.debug('User join: ' + ctx.message.from.id);
  addUserToStorage(ctx.message.chat.id, ctx.message.from.id, ctx.message.date);
});

bot.on('left_chat_member', (ctx) => {
  console.debug('User left: ' + ctx.message.from.id);
  deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
});

bot.on('message', (ctx) => {
  console.debug(ctx.message);
  if (ctx.message.text === undefined) {
    return;
  }
  console.debug('DUMP');
  console.debug(joinedUsers);

  console.debug(!isWhois(ctx.message.text), isUserJoinedRecently(ctx.message.chat.id, ctx.message.from.id));
  if (!isWhois(ctx.message.text) && isUserJoinedRecently(ctx.message.chat.id, ctx.message.from.id)) {
    console.debug(ctx.message.entities !== undefined);
    if (ctx.message.entities !== undefined || ctx.message.photo !== undefined || ctx.message.video !== undefined) {
      console.debug('user kicked: ' + ctx.message.chat.id);
      telegram.kickChatMember(ctx.message.chat.id, ctx.message.from.id);
      telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
      ctx.reply(`__Bot #${ctx.message.from.id} died.__`);
      deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
    }
  }
});
console.debug('Bot listening started');

setInterval(() => {
  let currentTimestamp = getCurrentTimestamp();
  joinedUsers = joinedUsers.filter(function (userInfo) {
    let isUserExpired = (currentTimestamp - EXPIRED_TIME) < userInfo.timestamp;
    if (isUserExpired) {
      console.debug('INTERVAL');
      console.log(userInfo);
    }
    return isUserExpired;
  });
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

isUserJoinedRecently = (chatId, userId) => {
  joinedUsers.forEach(function(userInfo) {
    if (userInfo.userId === userId && userInfo.chatId === chatId) {
      return true;
    }
  });

  return false;
};

deleteUserFromStorage = (chatId, userId) => {
  joinedUsers = joinedUsers.filter(function(userInfo) {
    return userInfo.userId !== userId && userInfo.chatId !== chatId;
  });
};

addUserToStorage = (chatId, userId, timestamp) => {
  joinedUsers.push({
    chatId: chatId,
    userId: userId,
    timestamp: timestamp,
  });
};
