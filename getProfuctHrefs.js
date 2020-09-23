const axios = require('axios');
const fs = require('fs');
const cheerio = require('cheerio');

const hrefsArray = [];
const hrefs = [
  'https://www.selver.ee/piimatooted-munad-void/piimad-koored',
  'https://www.selver.ee/piimatooted-munad-void/piimad-koored?p=2',
  'https://www.selver.ee/piimatooted-munad-void/piimad-koored?p=3',
  'https://www.selver.ee/piimatooted-munad-void/piimad-koored?p=4',
  'https://www.selver.ee/piimatooted-munad-void/kohupiimad-kodujuustud',
  'https://www.selver.ee/piimatooted-munad-void/kohupiimad-kodujuustud?p=2',
  'https://www.selver.ee/piimatooted-munad-void/kohupiimad-kodujuustud?p=3',
  'https://www.selver.ee/piimatooted-munad-void/kohupiimad-kodujuustud?p=4',
  'https://www.selver.ee/piimatooted-munad-void/jogurtid-jogurtijoogid?p=2',
  'https://www.selver.ee/piimatooted-munad-void/jogurtid-jogurtijoogid?p=3',
  'https://www.selver.ee/piimatooted-munad-void/jogurtid-jogurtijoogid?p=4',
  'https://www.selver.ee/piimatooted-munad-void/jogurtid-jogurtijoogid?p=5',
  'https://www.selver.ee/piimatooted-munad-void/jogurtid-jogurtijoogid?p=6',
  'https://www.selver.ee/piimatooted-munad-void/kohukesed',
  'https://www.selver.ee/piimatooted-munad-void/kohukesed?p=2',
  'https://www.selver.ee/piimatooted-munad-void/muud-magustoidud',
  'https://www.selver.ee/piimatooted-munad-void/muud-magustoidud?p=2',
  'https://www.selver.ee/piimatooted-munad-void/munad',
  'https://www.selver.ee/piimatooted-munad-void/void-margariinid',
  'https://www.selver.ee/piimatooted-munad-void/void-margariinid?p=2',
  'https://www.selver.ee/juustud/juustud',
  'https://www.selver.ee/juustud/juustud?p=2',
  'https://www.selver.ee/juustud/juustud?p=3',
  'https://www.selver.ee/juustud/juustud?p=4',
  'https://www.selver.ee/juustud/juustud?p=5',
  'https://www.selver.ee/juustud/maardejuustud',
  'https://www.selver.ee/juustud/maardejuustud?p=2',
  'https://www.selver.ee/juustud/maardejuustud?p=3',
  'https://www.selver.ee/juustud/delikatessjuustud',
  'https://www.selver.ee/juustud/delikatessjuustud?p=2',
  'https://www.selver.ee/juustud/delikatessjuustud?p=3',
  'https://www.selver.ee/juustud/delikatessjuustud?p=4',
  'https://www.selver.ee/juustud/delikatessjuustud?p=5',
];

async function getProductHrefs(url, tag) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const a = $('.products-grid a');
    // console.log(a.length);
    a.each((i, el) => {
      const { href } = el.attribs;
      if (href.slice(0, 22) === 'https://www.selver.ee/') {
        hrefsArray.push(href);
      }
    });
    console.log(`success search  this url=${url}`);
  } catch (error) {
    console.log(error);
  }
}
module.exports = async () => {
  for (const item of hrefs) {
    await getProductHrefs(item, 'a');
  }
  fs.writeFileSync('productsHref.js', JSON.stringify(hrefsArray));
  console.log('all hrefs were create');
  return 'success';
};
