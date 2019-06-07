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
        keywords: ['канал', 'удален'],
        coverage: 60
    }, {
        name: 'Твоя Удалёнка',
        link: 't.me/distantjob',
        desc: 'Публикуем самые свежие и актуальные вакансии на удалённую работу. ',
        keywords: ['канал', 'удален'],
        coverage:17
    }, {
        name: 'Премиум удалёнка',
        link: 't.me/remote_ru',
        desc: 'Cамая качественная, русскоязычная лента вакансий с удаленной работой.',
        keywords: ['канал', 'удален'],
        coverage:15
    }, {
        name: 'Remote IT (Inflow)',
        link: 't.me/Remoteit',
        desc: 'Вакансии и проекты на удаленку для it специалистов. Отбираются в ручную, публикуются минимум 2 в сутки.',
        keywords: ['канал', 'удален'],
        coverage: 17
    }, {
        name: 'Russian remote workers & freelancers',
        link: 't.me/ru_freelancers',
        desc: 'без описания',
        keywords: ['группа', 'удален', 'фриланс', 'freelance'],
        coverage:2
    }, {
        name: 'Finder.vc: удалённая работа - вакансии',
        link: 't.me/theyseeku',
        desc: 'Finder - крупнейшая в рунете площадка для поиска удалённой работы. Вакансии для любых специальностей.',
        keywords: ['группа', 'удален', 'фриланс', 'freelance'],
        coverage: 160
    }, {
        name: 'На удалёнке 2.0',
        link: 't.me/naudalenkebro',
        desc: 'Вакансии на удалёнку. Проектная работа.',
        keywords: ['группа', 'удален', 'фриланс', 'freelance'],
        coverage: 72
    },

    // programmers
    {
        name: 'Ищу веб-разработчика',
        link: 't.me/fordev',
        desc: 'Вакансии для веб-разработчиков.',
        keywords: ['группа', 'програм', 'web', 'веб', 'офис', 'удален', 'php', 'js', 'javascript', 'backend', 'frontend'],
        coverage: 1
    }, {
        name: 'Mobile Dev Jobs — вакансии и аналитика',
        link: 't.me/mobile_jobs',
        desc: 'Публикуем вакансии и запросы на поиск работы по направлению iOS, Android, Xamarin и т.д.',
        keywords: ['канал', 'ios', 'android', 'андроид', 'разраб', 'програм', 'офис', 'удален', 'мобил', 'java', 'C#', 'swift', 'objective'],
        coverage:7
    }, {
        name: 'JavaScript Jobs — чат',
        link: 't.me/javascript_jobs',
        desc: 'JavaScript Jobs — чат для поиска работы и людей.',
        keywords: ['группа', 'програм', 'web', 'веб', 'офис', 'удален', 'js', 'javascript', 'frontend', 'node']
        coverage: 9
    }, {
        name: 'DevOps Jobs - работа и аналитика',
        link: 't.me/devops_jobs',
        desc: 'Публикуем вакансии и запросы на поиск работы по направлению DevOps, Docker, CoreOS, Kubernetes и пр.',
        keywords: ['группа', 'програм', 'web', 'веб', 'офис', 'удален', 'сервер', 'devops', 'девопс', 'сисадмин', 'системный администратор', 'kubernetes', 'docker', 'coreos']
        coverage: 4
    }, {
        name: 'QA — вакансии и аналитика рынка вакансий',
        link: 't.me/qa_jobs',
        desc: 'Вакансии и поиск работы в сфере QA.',
        keywords: ['группа', 'програм', 'web', 'веб', 'офис', 'удален', 'qa', 'качеств', 'тест'],
        coverage: 7
    }, {
        name: 'Node.js Jobs — вакансии и аналитика',
        link: 't.me/nodejs_jobs',
        desc: 'Публикуем вакансии и запросы на поиск работы с глубоким пониманием Node.js и back-end.',
        keywords: ['группа', 'програм', 'web', 'веб', 'офис', 'удален', 'js', 'javascript', 'frontend', 'node'],
        coverage: 2
    }, {
        name: 'ТОП вакансии программистам',
        link: 't.me/jobGeeks',
        desc: 'Публикуются ТОЛЬКО ТОП ВАКАНСИИ для программистов, остальное банится.',
        keywords: ['группа', 'програм', 'удален', 'офис', 'веб', 'js', 'javascript', 'php', 'android', 'java', 'scala', 'mobile', 'мобил'],
        coverage: 2
    }, {
        name: 'Scala Jobs',
        link: 't.me/scala_jobs',
        desc: 'без описания',
        keywords: ['группа', 'програм', 'удален', 'офис', 'scala', 'скала'],
        coverage: 1
    }, {
        name: 'JavaScript Jobs — вакансии и резюме',
        link: 't.me/javascript_jobs_feed',
        desc: 'Вакансии из @javascript_jobs',
        keywords: ['канал', 'програм', 'удален', 'офис', 'javascript', 'js'],
        coverage: 6
    }, {
        name: 'JS Jobs',
        link: 't.me/jsjobs',
        desc: 'Более 1 000 участников. Канал с ботом вакансий с HeadHunter и Мойкруг в сфере Javascript.',
        keywords: ['канал', 'програм', 'удален', 'офис', 'javascript', 'js'],
        coverage: 1
    }, {
        name: 'Job for Frontenders + Node.js',
        link: 't.me/forfrontend',
        desc: 'Вакансии для фронтендеров. JavaScript + Node.js.',
        keywords: ['канал', 'програм', 'удален', 'офис', 'javascript', 'js', 'node'],
        coverage: 1
    }, {
        name: 'Node.js Jobs — вакансии и резюме',
        link: 't.me/nodejs_jobs_feed',
        desc: 'Вакансии из @nodejs_jobs',
        keywords: ['канал', 'програм', 'удален', 'офис', 'javascript', 'js', 'node'],
        coverage: 1
    },

    // digital/it
    {
        name: 'Jobs HR |Вакансии и Резюме',
        link: 't.me/workhrhr',
        desc: 'Делитесь Вакансиями и Резюме, интересными новостями, современными технологиями.',
        keywords: ['группа', 'програм', 'удален', 'офис', 'hr', 'веб', 'web', 'мобил', 'mobile'],
        coverage: 1
    },

    // management

    // other
    {
        name: 'Вакансии в продуктовых компаниях и стартапах',
        link: 't.me/djinni_productjobs',
        desc: 'Вакансии украинских стартапов и продуктовых компаний на Джинне.',
        keywords: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'удален', 'офис'],
        coverage: 3
    }, {
        name: 'Telegram IT Job',
        link: 't.me/myjobit',
        desc: 'IT Вакансии и резюме в офис.',
        keywords: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'офис'],
        coverage: 5
    },

    // cities
    {
        name: 'Интересная работа в Москве',
        link: 'https://t.me/promopoisk',
        desc: 'Самые актуальные и интересные вакансии Москвы. Вступай и будь в курсе свежих вакансий!',
        keywords: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'офис', 'москва'],
        coverage: 70
    }, {
        name: 'Интересная работа Петербурга',
        link: 'https://t.me/promopoiskspb',
        desc: 'Самые актуальные и интересные вакансии Петербурга. Вступай и будь в курсе свежих вакансий!',
        keywords: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'офис', 'спб', 'санкт', 'петербург', 'питер'],
        coverage: 6
    }, {
        name: 'Вакансии от Алёны Владимирской',
        link: 'https://t.me/alenavladimirskaya',
        desc: 'Лучшие вакансии, отобранные для вас вручную Аленой Владимирской.',
        keywords: ['канал', 'програм', 'менедж', 'devops', 'мобил', 'digital', 'startup', 'стартап', 'офис'],
        coverage: 54
    },
];

bot.start((ctx) => ctx.replyWithHTML(`Перечислите ключевые слова для поиска группы/канала через пробел, <b>без знаков препинания и спец-символов</b>. Например: "удаленные вакансии" или "мобильная разработка". Бот содержит ${CHANNELS.length} каналов и групп с общим охватом ${getAllCount()}.`));

const replySearch = (ctx) => {
    const message = ctx.message.text;
    if (message.length < 3) {
        return ctx.replyWithHTML('Для поиска нужно использовать минимум 3 символа.');
    }

    const options = {
        shouldSort: true,
        threshold: 0.3,
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

const getAllCount = () => {
    let count = 0;
    CHANNELS.forEach(value => {
        count += value.coverage;
    });

    return count * 1000;
};