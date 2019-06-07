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
console.debug('Bot listening started');
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
console.debug('Webhook started');

const CATEGORY_LIST = [
    ['Удалённые вакансии', 'remotes', [
        ['Удалёнка', 't.me/freelancefeed'],
        ['Твоя Удалёнка', 't.me/distantjob'],
        ['Премиум удалёнка', 't.me/remote_ru'],
        ['Remote IT (Inflow)', 't.me/Remoteit'],
        ['Russian remote workers & freelancers', 't.me/ru_freelancers']
    ]],
    ['Менеджмент', 'managers', [

    ]],
    ['IT/Digital', 'it-digital', [
        ['Ищу веб-разработчика', 't.me/fordev'],
    ]],
];

bot.start((ctx) => ctx.reply('Выберите нужную категорию, что бы просмотреть список чатов и каналов', categories()));

const categories = () => {
    const buttons = [];
    CATEGORY_LIST.forEach((value) => {
       buttons.push([Markup.callbackButton(value[0], value[1])]);
    });

    return Extra.markup(Markup.inlineKeyboard(buttons));
};

const category = (identifier) => {
    const list = [];
    CATEGORY_LIST.forEach((value) => {
        if (value[1] === identifier) {
            value[2].forEach(value => {
                list.push([Markup.urlButton(value[0], value[1])]);
            });
        }
    });

    return Extra.markup(Markup.inlineKeyboard(list));
};

bot.action(/.+/, (ctx) => {
    return ctx.reply('Список групп и каналов по выбранной аудитории:', category(ctx.match[0]));
});

bot.command('categories', (ctx) => categories());
