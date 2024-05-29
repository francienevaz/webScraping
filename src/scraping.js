const puppeteer = require('puppeteer');

// Função de espera customizada
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

async function getIrradiacaoSolar(lat, lon) {
  const browser = await puppeteer.launch({
    headless: false, // Set to non-headless for debugging
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  });
  const page = await browser.newPage();

  try {
    await page.goto('https://cresesb.cepel.br/index.php?section=sundata', { waitUntil: 'networkidle2' });

    // Wait for the page to load for 5 seconds
    await delay(5000);

    // Ensure selector is correct with a 60 second timeout
    // await page.waitForSelector('a[href="javascript:potencialEnergetico()"]', { timeout: 60000 });
    // await page.click('a[href="javascript:potencialEnergetico()"]');

    // Additional wait if necessary
    // await page.waitForTimeout(5000);

    // await page.waitForSelector('a[href="javascript:potencialSolar()"]', { timeout: 60000 });
    // await page.click('a[href="javascript:potencialSolar()"]');

    // Wait for next page to load
    // await page.waitForTimeout(5000);

    await page.waitForSelector('#latitude_dec', { timeout: 60000 });
    await page.type('#latitude_dec', lat);

    await page.waitForSelector('#longitude_dec', { timeout: 60000 });
    await page.type('#longitude_dec', lon);

    await page.waitForSelector('#submit_btn', { timeout: 60000 });
    await page.click('#submit_btn');

    // Wait for the result table with a 60 second timeout
    await page.waitForSelector('#data_output', { timeout: 60000 });

    const taxaDeIrradiacao = await page.evaluate(() => {
      const tabela = document.querySelector('#data_output');
      const linhas = tabela.querySelectorAll('tr');
      let menorMedia = Infinity;

      linhas.forEach(linha => {
        const colunas = linha.querySelectorAll('td');
        if (colunas.length > 0) {
          const media = parseFloat(colunas[6].innerText.replace(',', '.'));
          if (media < menorMedia) {
            menorMedia = media;
          }
        }
      });

      return menorMedia;
    });

    // Comment out to keep the browser open for debugging
    // await browser.close();
    return taxaDeIrradiacao;
  } catch (error) {
    console.error('Erro ao realizar o scraping:', error.message);
    await browser.close();
    return null;
  }
}

module.exports = { getIrradiacaoSolar };