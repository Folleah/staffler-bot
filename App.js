const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');

const API_TOKEN = process.env.API_TOKEN || 'your token';
const PORT = process.env.PORT || 3000;
const URL = process.env.BOT_URL || 'https://yourappname.herokuapp.com';
const EXPIRED_TIME = 60 * 10;
const CHAT_HISTORY_EXPIRED = 60;
let joinedUsers = [];
let chatHistory = [];

console.debug('App port: ' + PORT);
console.debug('url: ' + URL);

const bot = new Telegraf(API_TOKEN);
const telegram = new Telegram(API_TOKEN);
console.debug('Bot initiated.');
bot.start((ctx) => ctx.reply('This bot can not be used for personal interaction. Just add it to the chat and assign control to delete users and messages.'));

bot.on('new_chat_members', (ctx) => {
  console.debug('User join: ' + ctx.message.from.id);
  addUserToStorage(ctx.message.chat.id, ctx.message.from.id, ctx.message.date);
  telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
});

bot.on('left_chat_member', (ctx) => {
  console.debug('User left: ' + ctx.message.from.id);
  deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
  telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
});

bot.on('message', (ctx) => {
  chatHistory.push({
    chatId: ctx.message.chat.id,
    userId: ctx.message.from.id,
    messageId: ctx.message.message_id,
    timestamp: ctx.message.date
  });
  telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id).then(function(onFulfilled) {
    if (!isUserJoinedRecently(ctx.message.chat.id, ctx.message.from.id)) {
      return;
    }

    if (onFulfilled.status === 'creator' || onFulfilled.status === 'administrator') {
      return;
    }

    if (isWhois(ctx.message.text)) {
      deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
      return;
    }

    if (ctx.message.entities !== undefined || ctx.message.photo !== undefined || ctx.message.video !== undefined) {
      console.debug('user kicked: ' + ctx.message.from.id);
      ctx.replyWithHTML(`<i>Bot #${ctx.message.from.id} died.</i>`);
      telegram.kickChatMember(ctx.message.chat.id, ctx.message.from.id);
      deleteUserMessages(ctx.message.chat.id, ctx.message.from.id);
      deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
      console.debug(`Bot #${ctx.message.from.id} died.`);
    }
  });
});
console.debug('Bot listening started');

setInterval(() => {
  let currentTimestamp = getCurrentTimestamp();
  joinedUsers = joinedUsers.filter(function (userInfo) {
    return (currentTimestamp - EXPIRED_TIME) < userInfo.timestamp;
  });

  chatHistory = chatHistory.filter(function (message) {
    return (currentTimestamp - CHAT_HISTORY_EXPIRED) < message.timestamp;
  });
}, 5 * 1000);

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
console.debug('Webhook started');

getCurrentTimestamp = () => {
  return Math.round(+new Date()/1000);
};

isWhois = (message) => {
  if (message === undefined) {
    return false;
  }

  return message.search('#whois') !== -1;
};

isUserJoinedRecently = (chatId, userId) => {
  let res = false;
  joinedUsers.forEach(function(userInfo) {
    if (userInfo.userId === userId && userInfo.chatId === chatId) {
      res = true;
    }
  });

  return res;
};

deleteUserFromStorage = (chatId, userId) => {
  joinedUsers = joinedUsers.filter(function(userInfo) {
    return userInfo.userId !== userId && userInfo.chatId !== chatId;
  });
};

addUserToStorage = (chatId, userId, timestamp) => {
  if (isUserJoinedRecently(chatId, userId)) {
    return;
  }

  joinedUsers.push({
    chatId: chatId,
    userId: userId,
    timestamp: timestamp,
  });
};

deleteUserMessages = (chatId, userId) => {
  chatHistory.forEach(function (message) {
    telegram.deleteMessage(chatId, message.messageId);
  });
};
