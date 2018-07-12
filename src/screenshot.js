const puppeteer = require('puppeteer');

const config = require('./config/index');
const srcToImg = require('./helper/srcToImg');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(config.address);
  console.log(`go to ${config.address}`);
  // await page.screenshot({
  //   path: `${config.screenshot}/${Date.now()}.png`
  // });
  // await browser.close();


  await page.setViewport({
    width: 1920,
    height: 1080
  });
  console.log('resize viewport');

  await page.focus('#kw');
  await page.keyboard.sendCharacter(config.word);
  await page.keyboard.press('Enter');
  // await page.click('.s_btn');
  console.log('start search');

  page.on('load', async () => {
    console.log('search end');
    
    const srcs = await page.evaluate(() => {
      const images = document.querySelectorAll('img.main_img');
      return Array.prototype.map.call(images, img => img.src);
    });

    srcs.forEach(async (src) => {
      //sleep
      await page.waitFor(300);
      srcToImg(src, config.imgs);
    });

    await browser.close();
  });
})();