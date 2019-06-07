const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');

const API_TOKEN = process.env.API_TOKEN || 'yourtoken';
const PORT = process.env.PORT || 3000;
const URL = process.env.BOT_URL || 'app url';

console.debug('App port: ' + PORT);
console.debug('url: ' + URL);

const bot = new Telegraf(API_TOKEN);
const telegram = new Telegram(API_TOKEN);
console.debug('Bot initiated.');

const CATEGORY_LIST = [
    ['Удалённые вакансии', 'remotes', [
        'RemoteOK', ''
    ]],
    ['IT/Digital', 'it-digital', [
        'Ищу веб-разработчика', 't.me/fordev',

    ]],
];

bot.start((ctx) => ctx.reply('Выберите нужную категорию, что бы просмотреть список чатов и каналов', categories));

const categories = () => {
    const buttons = [];
    CATEGORY_LIST.forEach((value) => {
       buttons.push(Markup.callbackButton(value[0], value[1]));
    });

    return Extra.markup(Markup.inlineKeyboard(buttons));
};

bot.action(/.+/, (ctx) => {
    return ctx.answerCbQuery(`Oh, ${ctx.match[0]}! Great choice`)
});

bot.command('test', (ctx) => categories(ctx));

bot.command('inline', (ctx) => {
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.urlButton('Pepsi', '@sonofrevolution'),
            m.callbackButton('Pepsi', 'Pepsi')
        ])))
});

// bot.on('text', (ctx) => ctx.reply('Hello World'));

bot.command('onetime', ({ reply }) =>
    reply('One time keyboard', Markup
        .keyboard(['/simple', '/inline', '/pyramid'])
        .oneTime()
        .resize()
        .extra()
    )
)

bot.command('custom', ({ reply }) => {
    return reply('Custom buttons keyboard', Markup
        .keyboard([
            ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
            ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
            ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
        ])
        .oneTime()
        .resize()
        .extra()
    )
})

bot.hears('🔍 Search', ctx => ctx.reply('Yay!'))
bot.hears('📢 Ads', ctx => ctx.reply('Free hugs. Call now!'))

bot.command('special', (ctx) => {
    return ctx.reply('Special buttons keyboard', Extra.markup((markup) => {
        return markup.resize()
            .keyboard([
                markup.contactRequestButton('Send contact'),
                markup.locationRequestButton('Send location')
            ])
    }))
})

bot.command('pyramid', (ctx) => {
    return ctx.reply('Keyboard wrap', Extra.markup(
        Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
            wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2
        })
    ))
})

bot.command('simple', (ctx) => {
    return ctx.replyWithHTML('<b>Coke</b> or <i>Pepsi?</i>', Extra.markup(
        Markup.keyboard(['Coke', 'Pepsi'])
    ))
})

bot.command('inline', (ctx) => {
    return ctx.reply('<b>Coke</b> or <i>Pepsi?</i>', Extra.HTML().markup((m) =>
        m.inlineKeyboard([
            m.callbackButton('Coke', 'Coke'),
            m.callbackButton('Pepsi', 'Pepsi')
        ])))
})

bot.command('random', (ctx) => {
    return ctx.reply('random example',
        Markup.inlineKeyboard([
            Markup.callbackButton('Coke', 'Coke'),
            Markup.callbackButton('Dr Pepper', 'Dr Pepper', Math.random() > 0.5),
            Markup.callbackButton('Pepsi', 'Pepsi')
        ]).extra()
    )
})

bot.command('caption', (ctx) => {
    return ctx.replyWithPhoto({ url: 'https://picsum.photos/200/300/?random' },
        Extra.load({ caption: 'Caption' })
            .markdown()
            .markup((m) =>
                m.inlineKeyboard([
                    m.callbackButton('Plain', 'plain'),
                    m.callbackButton('Italic', 'italic')
                ])
            )
    )
})

bot.hears(/\/wrap (\d+)/, (ctx) => {
    return ctx.reply('Keyboard wrap', Extra.markup(
        Markup.keyboard(['one', 'two', 'three', 'four', 'five', 'six'], {
            columns: parseInt(ctx.match[1])
        })
    ))
})

bot.action('Dr Pepper', (ctx, next) => {
    return ctx.reply('👍').then(() => next())
})

bot.action('plain', async (ctx) => {
    ctx.editMessageCaption('Caption', Markup.inlineKeyboard([
        Markup.callbackButton('Plain', 'plain'),
        Markup.callbackButton('Italic', 'italic')
    ]))
})

bot.action('italic', (ctx) => {
    ctx.editMessageCaption('_Caption_', Extra.markdown().markup(Markup.inlineKeyboard([
        Markup.callbackButton('Plain', 'plain'),
        Markup.callbackButton('* Italic *', 'italic')
    ])))
})
console.debug('Bot listening started');

bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
console.debug('Webhook started');


// bot.on('new_chat_members', (ctx) => {
//   console.debug('User join: ' + ctx.message.from.id);
//   addUserToStorage(ctx.message.chat.id, ctx.message.from.id, ctx.message.date);
//   telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
// });
//
// bot.on('left_chat_member', (ctx) => {
//   console.debug('User left: ' + ctx.message.from.id);
//   deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
//   telegram.deleteMessage(ctx.message.chat.id, ctx.message.message_id);
// });
//
// bot.on('message', (ctx) => {
//   chatHistory.push({
//     chatId: ctx.message.chat.id,
//     userId: ctx.message.from.id,
//     messageId: ctx.message.message_id,
//     timestamp: ctx.message.date
//   });
//   telegram.getChatMember(ctx.message.chat.id, ctx.message.from.id).then(function(onFulfilled) {
//     if (!isUserJoinedRecently(ctx.message.chat.id, ctx.message.from.id)) {
//       return;
//     }
//
//     if (onFulfilled.status === 'creator' || onFulfilled.status === 'administrator') {
//       return;
//     }
//
//     if (isWhois(ctx.message.text)) {
//       deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
//       return;
//     }
//
//     if (ctx.message.entities !== undefined || ctx.message.photo !== undefined || ctx.message.video !== undefined) {
//       console.debug('user kicked: ' + ctx.message.from.id);
//       //ctx.replyWithHTML(`<i>Bot #${ctx.message.from.id} died.</i>`);
//       telegram.kickChatMember(ctx.message.chat.id, ctx.message.from.id);
//       deleteUserMessages(ctx.message.chat.id, ctx.message.from.id);
//       deleteUserFromStorage(ctx.message.chat.id, ctx.message.from.id);
//       console.debug(`Bot #${ctx.message.from.id} died.`);
//     }
//   });
// });

//
// setInterval(() => {
//   let currentTimestamp = getCurrentTimestamp();
//   joinedUsers = joinedUsers.filter(function (userInfo) {
//     return (currentTimestamp - EXPIRED_TIME) < userInfo.timestamp;
//   });
//
//   chatHistory = chatHistory.filter(function (message) {
//     return (currentTimestamp - CHAT_HISTORY_EXPIRED) < message.timestamp;
//   });
// }, 5 * 1000);
//

// getCurrentTimestamp = () => {
//   return Math.round(+new Date()/1000);
// };
//
// isWhois = (message) => {
//   if (message === undefined) {
//     return false;
//   }
//
//   return message.search('#whois') !== -1;
// };
//
// isUserJoinedRecently = (chatId, userId) => {
//   let res = false;
//   joinedUsers.forEach(function(userInfo) {
//     if (userInfo.userId === userId && userInfo.chatId === chatId) {
//       res = true;
//     }
//   });
//
//   return res;
// };
//
// deleteUserFromStorage = (chatId, userId) => {
//   joinedUsers = joinedUsers.filter(function(userInfo) {
//     return userInfo.userId !== userId && userInfo.chatId !== chatId;
//   });
// };
//
// addUserToStorage = (chatId, userId, timestamp) => {
//   if (isUserJoinedRecently(chatId, userId)) {
//     return;
//   }
//
//   joinedUsers.push({
//     chatId: chatId,
//     userId: userId,
//     timestamp: timestamp,
//   });
// };
//
// deleteUserMessages = (chatId, userId) => {
//   chatHistory.forEach(function (message, index) {
//     if (message.userId === userId) {
//       telegram.deleteMessage(chatId, message.messageId);
//     }
//   });
// };
