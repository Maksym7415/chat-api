
const $ = require('cheerio');
const puppeteer = require('puppeteer');

const url = 'https://ecoop.ee/et/kategooriad/jogurtid/';
module.exports = () => {
let scollCount = 0
    function extractItems() {
        const extractedElements = document.querySelectorAll('#boxes > div.box');
        const items = [];
        for (let element of extractedElements) {
          items.push(element.innerText);
        }
        return items;
      }
      
      async function scrapeInfiniteScrollItems(
        page,
        extractItems,
        itemTargetCount,
        scrollDelay = 1000,
      ) {
        let items = [];
        try {
          let previousHeight;
          while (items.length < itemTargetCount) {       
            items = await page.evaluate(extractItems);
           
            previousHeight = await page.evaluate('document.body.scrollHeight');
            await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
            await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
            await page.waitFor(scrollDelay);
            scollCount += 1
            console.log(`pages downloaded - ${scollCount}`);
            console.log('waiting for result');
          }
        } catch(e) { }
        return items;
      }
      
      (async () => {
        // Set up browser and page.
        // settings for launch
        //{
        //  headless: false,
        //  args: ['--no-sandbox', '--disable-setuid-sandbox'],
       // } 
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setViewport({ width: 1280, height: 926 });
      
        // Navigate to the demo page.
        console.log('download html...');
        await page.goto(url);
        
        // Scroll and extract items from the page.
        console.log('begin scroll...');
        //const items = await scrapeInfiniteScrollItems(page, extractItems, 100);
        console.log('end scroll');

        const html = await page.content()


        // RIMI

        // const rimiFullProductsData = []
        // const rimiName = $('.card__name', html)
        // const rimiPrice = $('.card__price', html)
        // const rimiPricePer = $('.card__price-per', html)
        // rimiName.each((index, el) => rimiFullProductsData.push({productName: $(el).text().replace(/\s+/g, ' ').trim()}))
        // rimiPrice.each((index, el) => rimiFullProductsData[index] = {...rimiFullProductsData[index], price: $(el).text().replace(/\s+/g, ' ').trim()})
        // rimiPricePer.each((index, el) =>rimiFullProductsData[index] = {...rimiFullProductsData[index], pricePer: $(el).text().replace(/\s+/g, ' ').trim()})
        // console.log(rimiFullProductsData)

        //COOP

        // const fullProductsData = []
        // const name =  $('.item-name', html);
        // const countPerTk = $('.item-count', html);
        // const count = $('.item-details > h2', html);
        // name.each((index, el) => fullProductsData.push({productName: $(el).text()}))
        // count.each((index, el) => fullProductsData[index] = {...fullProductsData[index], price: $(el).text()})
        // countPerTk.each((index, el) => fullProductsData[index] = {...fullProductsData[index], pricePer: $(el).text()})
        // console.log(fullProductsData);
        // Save extracted items to a file.
        //fs.writeFileSync('./items.txt', items.join('\n') + '\n');
      
        // Close the browser.
        await browser.close();
      })();
}




// puppeteer
//   .launch()
//   .then(function(browser) {
//     return browser.newPage();
//   })
//   .then(function(page) {
//     return page.goto(url).then(function() {
//       return page.content();
//     });
//   })
//   .then(function(html) {
//     const name =  $('.item-name', html);
//     const countPerTk = $('.item-count', html)
//     const count = $('.item-details > h2', html);
//    //console.log(name.text())
//    // console.log(countPerTk.text())

//   // PRICE 

//   const fullProductsData = []

//   //  count.each((index, el) => console.log($(el).text()))

//     // const price =  count.text().split('/').map((el, index, arr) => {
//     //   if(index === 0) {
//     //     return el + '/tk'
//     //   } 
//     //   return el.slice(2) + '/tk' 
       
//     // })
//     // price.splice(price.length - 1)

//     // PRODUCT NAME
//     name.each((index, el) => fullProductsData.push({productName: $(el).text()}))
//     count.each((index, el) => fullProductsData[index] = {...fullProductsData[index], count: $(el).text()})
//     countPerTk.each((index, el) => fullProductsData[index] = {...fullProductsData[index], countByPoint: $(el).text()})
//     console.log(fullProductsData)
//     // PRICE BY TK
//     // countPerTk.each((index, el) => console.log($(el).text()))


//   })
//     //console.log(html.text().split('\n').replace(/\r\n|\r|\t|\n/g, '').replace(/\s+/g, '').trim().filter(el => el));
//   .catch(function(err) {
//     //handle error
//   });
