const Queue = require('bull');
const puppeteer = require('puppeteer');
const path = require("path");

// https://github.com/OptimalBits/bull/blob/develop/docs/README.md
const jobs = new Queue('ac-website-qa-jobs', {
    redis: {
        port: 6379,
        host: '127.0.0.1'
    }
});

jobs.process(async (job) => {
    let output = `./screenshots/${job.data.breakpoint.name}/${job.data.basename}.png`;
    console.log(`attempting to save ${job.data.breakpoint.name} for ${job.data.url} at ${output}`);
    // TODO: mkdir -p to check it is writable

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(job.data.url);
    await page.setViewport({
        width: job.data.breakpoint.width,
        height: 1
    });
    await page.screenshot({
        path: output,
        fullPage: true,
        deviceScaleFactor: 2
    });
    await page.close();
    await browser.close();

    return output;
});
