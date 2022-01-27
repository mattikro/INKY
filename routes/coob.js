const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

function screenshot(page) {
    page.screenshot({path: './public/capture.jpg', type: 'jpeg', clip: {x: 224, y: 0, width: 64, height: 64}})
    console.log(Date.now())
}

async function run() {
    let browser = await puppeteer.launch({
        headless: true, defaultViewport: null
    });
    let page = await browser.newPage();
    await page.setViewport({width: 512, height: 64})
    await page.goto('https://www.youtube.com/embed/2X0W2EH8KH0?controls=0&loop=1&showinfo=0&autoplay=1&mute=1&enablejsapi=1');
    //await page.goto('localhost:3000/inky');
    setInterval(() => screenshot(page), 50);
}

run().then(() => console.log('stream started'));

router.get('/', (req, res) => {
    res.render('coob')
});


module.exports = router;
