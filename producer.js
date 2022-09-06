const Queue = require('bull');
let Parser = require('rss-parser');
const path = require("path");

let breakpoints = [
    { name: "00-xs-max", width: 639 },
    { name: "01-sm-min", width: 640 },
    { name: "02-sm-max", width: 767 },
    { name: "03-md-min", width: 768 },
    { name: "04-md-max", width: 1023 },
    { name: "05-lg-min", width: 1024 },
    { name: "06-lg-max", width: 1279 },
    { name: "07-xl-min", width: 1280 },
    { name: "08-xl-max", width: 1535 },
    { name: "09-2xl-min", width: 1546 },
];

// https://dev.to/franciscomendes10866/how-to-create-a-job-queue-using-bull-and-redis-in-nodejs-20ck
let jobs = new Queue('ac-website-qa-jobs', {
    redis: {
        port: 6379,
        host: '127.0.0.1'
    }
});

const produce = async () => {
    let parser = new Parser();
    // TODO: read URL from env
    // TODO: add slice option from env
    const feed = await parser.parseURL('http://localhost:1313/articles/index.xml');

    const num_items = feed.items.length;
    const num_screenshots = num_items * breakpoints.length;
    console.log(`Pages: ${num_items}`);
    console.log(`Jobs: ${num_screenshots}`);

    for (const item of feed.items) {
        for (const breakpoint of breakpoints) {
            const job = {
                breakpoint: breakpoint,
                basename: path.basename(item.link),
                url: item.link
            };

            await jobs.add(job);
        }
    }

    console.log('Done!');
};

produce().finally(() => process.exit());
