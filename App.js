const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');
const Fuse = require('fuse.js');

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

const CHANNELS = [
    // remote
    {
        name: 'Удалёнка',
        link: 't.me/freelancefeed',
        desc: 'Самая интересная лента вакансий с удаленной работой.',
        keywords: ['channel', 'remote', 'freelance']
    }, {
        name: 'Твоя Удалёнка',
        link: 't.me/distantjob',
        desc: 'Публикуем самые свежие и актуальные вакансии на удалённую работу. ',
        keywords: ['channel', 'remote', 'freelance']
    }, {
        name: 'Премиум удалёнка',
        link: 't.me/remote_ru',
        desc: 'Cамая качественная, русскоязычная лента вакансий с удаленной работой.',
        keywords: ['channel', 'remote', 'freelance']
    }, {
        name: 'Remote IT (Inflow)',
        link: 't.me/Remoteit',
        desc: 'Вакансии и проекты на удаленку для it специалистов. Отбираются в ручную, публикуются минимум 2 в сутки.',
        keywords: ['channel', 'remote', 'freelance']
    }, {
        name: 'Russian remote workers & freelancers',
        link: 't.me/ru_freelancers',
        desc: 'отсутствует',
        keywords: ['group', 'remote', 'freelance']
    },

    // programmers
    {
        name: 'Ищу веб-разработчика',
        link: 't.me/fordev',
        desc: 'Вакансии для веб-разработчиков.',
        tags: ['group', 'programmers', 'web']
    },

    // digital/it

    // management

    // other
    {
        name: 'Вакансии в продуктовых компаниях и стартапах',
        link: 't.me/djinni_productjobs',
        desc: 'Вакансии украинских стартапов и продуктовых компаний на Джинне.',
        tags: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'удален', 'офис']
    }, {
        name: 'Telegram IT Job',
        link: 't.me/myjobit',
        desc: 'IT Вакансии и резюме в офис.',
        tags: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'офис']
    }
];

bot.start((ctx) => ctx.replyWithHTML('Перечислите ключевые слова для поиска группы/канала через пробел, <b>без знаков препинания и спец-символов</b>. Например: "удаленные вакансии" или "мобильная разработка"'));

const replySearch = (ctx) => {
    if (ctx.message.length < 5) {
        return ctx.replyWithHTML('Для поиска нужно использовать минимум 5 символов.');
    }
    console.log(ctx.message);
    const options = {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
            'name', 'desc'
        ]
    };

    let fuse = new Fuse(CHANNELS, options);
    let result = fuse.search('удален');

    if (result.length === 0) {
        return ctx.replyWithHTML(`По запросу <code>${ctx.message}</code> ничего не найдено. Попробуйте сократить, либо увеличить поисковый запрос.`);
    }

    let formattedResult = [];
    result.forEach(value => {
       formattedResult.push(`<a href="${value.link}">${value.name}</a>\n<i>${value.desc}</i>\n`);
    });

    return ctx.replyWithHTML(formattedResult.join());
};

bot.on('message', (ctx) => replySearch(ctx));