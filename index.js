console.log("Puppet started");

const puppeteer = require('puppeteer');
const fs = require('fs');

let file = fs.readFileSync('config.json');
let config = JSON.parse(file);

const args = [
    '--ignore-certificate-errors',
    '--ignore-certificate-errors-spki-list '
]

const options = {
    args,
    //headless: false,
    ignoreHTTPSErrors: true,
  };

(async () => {
  const browser = await puppeteer.launch(options);
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1280, deviceScaleFactor: 1 });
  await page.goto(config.grafana.host);
  await page.type('.login-form input[name="username"]', config.grafana.username);
  await page.type('.login-form input[name="password"]', config.grafana.password);
  await page.click('form[name="loginForm"] .login-button-group button')
  await page.waitFor(1000);
  await page.click('a.btn.btn-link');
  await page.waitForNavigation({ waitUntil: 'networkidle0' }),
  await page.screenshot({path: 'grafana.png'});

  await browser.close();
})();