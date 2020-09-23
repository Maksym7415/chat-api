const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');
const { Products } = require('./models')
const fullDataProductsObj = {};
let prName;
let price;
let unitPrice;
let productName;

async function getMenu(url, tag) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

     prName = $('#product-attribute-specs-table');
     price = $('.price-box');
     unitPrice = $('.unit-price');
     productName = $('.page-title');

    const  getFullProductInfo =  async (prName, price, productName, unitPrice) => {
      //console.log(prName, price, productName, unitPrices)
      const data = prName.text().split('\n').map((el) => el.replace(/\s+/g, ' ').trim()).filter((el, index) => el);
      const name = productName.text().replace(/\s+/g, ' ').trim();
      const productPrice = price.text().replace(/\s+/g, ' ').trim().slice(0, 7);
      const pricePerNumber = unitPrice.text().replace(/\s+/g, ' ').trim();
      try{
        if (data.length < 8) {
          // return fullDataProductsObj[name] = {
          //   productName: name,
          //   productPrice,
          //   unitPrice: pricePerNumber.slice(0, 9),
          //   barCode: data[1],
          //   manufacturer: data[3],
          //   prodCountry: data[5],
          // };
          await Products.create({
            productName: name,
            productPrice,
            unitPrice: pricePerNumber.slice(0, 9),
            barCode: data[1],
            manufacturer: data[3],
            prodCountry: data[5]
          })
          return;
        }
        await Products.create({
          productName: name,
          productPrice,
          unitPrice: pricePerNumber,
          partnerPrice: data[1],
          barCode: data[3],
          manufacturer: data[5],
          prodCountry: data[7]
        })
        // fullDataProductsObj[name] = {
        //   productName: name,
        //   productPrice,
        //   unitPrice: pricePerNumber,
        //   partnerPrice: data[1],
        //   barCode: data[3],
        //   manufacturer: data[5],
        //   prodCountry: data[7],
        // };
        console.log(`parse success for this url=${url}`);
      }catch(e) {
        console.log({e})
      }
      
    };

    getFullProductInfo(prName, price, productName, unitPrice);
  } catch (error) {
    console.log(error);
    // getMenu(error.config.url);
  }
}

const removeDublicate = (state) => {
  const result = [];
  const dublicateUrl = []
  const map = new Map();
      for (const item of state) {
          if(!map.has(item)){
              map.set(item, true);
              result.push(item);
          }
          else {
            dublicateUrl.push(item)
          }
      }
  return {result, dublicateUrl}
}



module.exports = async () => {
  const productHrefs = fs.readFileSync('./productsHref.js', { encoding: 'utf8' });
  let parsingTime;
  let currentDate = Date.now();
  //const {result, dublicateUrl} = removeDublicate(JSON.parse(productHrefs))
    for (const item of JSON.parse(productHrefs)) {
      const href = item.split('/');
      await getMenu(item, href[href.length - 1]);
    }

    parsingTime = Date.now() - currentDate;
    console.log(`time spend for parsing - ${new Date(parsingTime).getMinutes}minutes  ${new Date(parsingTime).getSeconds} seconds`)
    console.log(JSON.parse(productHrefs).length)
 
};






 // JSON.parse(productHrefs).forEach(async (item) => { // parallel parsing
  //   const href = item.split('/');
  //   setTimeout(async () => await getMenu(item, href[href.length - 1]), 50);
  // });
  //await getMenu('https://www.selver.ee/valgehallitusjuust-danish-brie-castello-125-g') 









// SELVER
// const prName = $('.product-name');
// const price = $('.price-box');
// const unitPrice = $('.unit-price');
// prName.map((i, el) => {
//   fullDataProductsObj = { ...fullObj, [i]: { title: $(el).text().trim() } };
// });
// price.map((i, el) => {
//   fullDataProductsObj = { ...fullObj, [i]: { ...fullObj[i], price: $(el).text().slice(0, 9).trim() } };
// });
// unitPrice.map((i, el) => {
//   fullDataProductsObj = { ...fullObj, [i]: { ...fullObj[i], unitPrice: $(el).text().trim() } };
// });

// SELVER  Specific Product
