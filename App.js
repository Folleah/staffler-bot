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

const TAGS = [
    {
        tag: 'remote',
        name: 'Удалённая работа'
    }, {
        tag: 'freelance',
        name: 'Фриланс'
    }, {
        tag: 'web',
        name: 'Веб-разработка'
    }, {
        tag: 'mobile',
        name: 'Мобильная разработка'
    }, {
        tag: 'devops',
        name: 'Сис. админы и devops'
    }, {
        tag: 'startup',
        name: 'Стартапы'
    }
];

const CHANNELS = [
    // remote
    {
        name: 'Удалёнка',
        link: 't.me/freelancefeed',
        desc: 'Самая интересная лента вакансий с удаленной работой.',
        tags: ['channel', 'remote', 'freelance']
    }, {
        name: 'Твоя Удалёнка',
        link: 't.me/distantjob',
        desc: 'Публикуем самые свежие и актуальные вакансии на удалённую работу. ',
        tags: ['channel', 'remote', 'freelance']
    }, {
        name: 'Премиум удалёнка',
        link: 't.me/remote_ru',
        desc: 'Cамая качественная, русскоязычная лента вакансий с удаленной работой.',
        tags: ['channel', 'remote', 'freelance']
    }, {
        name: 'Remote IT (Inflow)',
        link: 't.me/Remoteit',
        desc: 'Вакансии и проекты на удаленку для it специалистов. Отбираются в ручную, публикуются минимум 2 в сутки.',
        tags: ['channel', 'remote', 'freelance']
    }, {
        name: 'Russian remote workers & freelancers',
        link: 't.me/ru_freelancers',
        desc: 'отсутствует',
        tags: ['group', 'remote', 'freelance']
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
        tags: ['channel', 'programmers', 'managers', 'devops', 'mobile', 'digital', 'startup', 'remote', 'office']
    }, {
        name: 'Telegram IT Job',
        link: 't.me/myjobit',
        desc: 'IT Вакансии и резюме в офис.',
        tags: ['channel', 'programmers', 'managers', 'devops', 'mobile', 'digital', 'startup', 'office']
    }
];

bot.start((ctx) => ctx.reply('Воспользуйтесь меню, что бы управлять ботом. Меню открывается около поля ввода текста.', categories()));

const categories = () => {
    return Markup.keyboard([
        ['🔍 Search', '😎 Popular'], // Row1 with 2 buttons
        ['☸ Setting', '📞 Feedback'], // Row2 with 2 buttons
        ['📢 Ads', '⭐️ Rate us', '👥 Share'] // Row3 with 3 buttons
    ])
    .oneTime()
    .resize()
    .extra();
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

bot.command('list', (ctx) => categories());
