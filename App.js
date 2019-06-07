const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const Extra = require('telegraf/extra');
const Fuse = require('fuse.js');

const API_TOKEN = process.env.API_TOKEN || 'yourtoken';
const PORT = process.env.PORT || 3000;
const URL = process.env.BOT_URL || 'app url';

console.debug('App port: ' + PORT);
console.debug('url: ' + URL);

const bot = new Telegraf(API_TOKEN);
const telegram = new Telegram(API_TOKEN);
const SEARCH_MESSAGE = '<b>По вашему запросу были найдены следующие каналы и группы:</b>\n\n';

console.debug('Bot initiated.');
console.debug('Bot listening started');
bot.telegram.setWebhook(`${URL}/bot${API_TOKEN}`);
bot.startWebhook(`/bot${API_TOKEN}`, null, PORT);
console.debug('Webhook started');

const CHANNELS = [
    // remote
    {
        name: 'Удалёнка',
        link: 't.me/freelancefeed',
        desc: 'Самая интересная лента вакансий с удаленной работой.',
        keywords: ['канал', 'удален']
    }, {
        name: 'Твоя Удалёнка',
        link: 't.me/distantjob',
        desc: 'Публикуем самые свежие и актуальные вакансии на удалённую работу. ',
        keywords: ['канал', 'удален']
    }, {
        name: 'Премиум удалёнка',
        link: 't.me/remote_ru',
        desc: 'Cамая качественная, русскоязычная лента вакансий с удаленной работой.',
        keywords: ['канал', 'удален']
    }, {
        name: 'Remote IT (Inflow)',
        link: 't.me/Remoteit',
        desc: 'Вакансии и проекты на удаленку для it специалистов. Отбираются в ручную, публикуются минимум 2 в сутки.',
        keywords: ['канал', 'удален',]
    }, {
        name: 'Russian remote workers & freelancers',
        link: 't.me/ru_freelancers',
        desc: 'отсутствует',
        keywords: ['группа', 'удален', 'фриланс', 'freelance']
    },

    // programmers
    {
        name: 'Ищу веб-разработчика',
        link: 't.me/fordev',
        desc: 'Вакансии для веб-разработчиков.',
        keywords: ['группа', 'програм', 'web', 'веб', 'офис', 'удален']
    }, {
        name: '',
        link: '',
        desc: 'Публикуем вакансии и запросы на поиск работы по направлению iOS, Android, Xamarin и т.д.',
        keywords: ['канал', 'ios', 'android', 'андроид', 'разраб', 'програм', 'офис', 'удален', 'мобил']
    },

    // digital/it

    // management

    // other
    {
        name: 'Вакансии в продуктовых компаниях и стартапах',
        link: 't.me/djinni_productjobs',
        desc: 'Вакансии украинских стартапов и продуктовых компаний на Джинне.',
        keywords: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'удален', 'офис']
    }, {
        name: 'Telegram IT Job',
        link: 't.me/myjobit',
        desc: 'IT Вакансии и резюме в офис.',
        keywords: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'офис']
    }
];

bot.start((ctx) => ctx.replyWithHTML('Перечислите ключевые слова для поиска группы/канала через пробел, <b>без знаков препинания и спец-символов</b>. Например: "удаленные вакансии" или "мобильная разработка"'));

const replySearch = (ctx) => {
    const message = ctx.message.text;
    if (message.length < 3) {
        return ctx.replyWithHTML('Для поиска нужно использовать минимум 3 символа.');
    }

    const options = {
        shouldSort: true,
        threshold: 0.7,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            'name', 'desc', 'keywords'
        ]
    };

    let fuse = new Fuse(CHANNELS, options);
    let result = fuse.search(message);

    if (result.length === 0) {
        return ctx.replyWithHTML(`По запросу <code>${message}</code> ничего не найдено. Попробуйте сократить, либо увеличить поисковый запрос.`);
    }

    let formattedResult = [];
    result.forEach(value => {
       formattedResult.push(`<a href="${value.link}">${value.name}</a>\n<i>${value.desc}</i>`);
    });

    return ctx.replyWithHTML(SEARCH_MESSAGE + formattedResult.join('\n\n'), Extra.webPreview(false));
};

bot.on('message', (ctx) => replySearch(ctx));