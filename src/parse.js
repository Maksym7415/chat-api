const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
let DomParser = require('dom-parser');

async function getHtml() {
  let documentParse = [];
  const response = await axios.get('https://pulcinella.ee/our-menu/', { responseType: 'document' });
  let menu = response.data.split('<body')[1].replace(/\r\n|\r|\t|\n/g, '').replace(/(<([^>]+)>)/g, '^').split('^');
  menu = menu.filter((el) => el.trim());
  // console.log(menu);
  menu.forEach((el, i, arr) => {
    if (el.toLowerCase().includes('€') && el.length < 15) {
      documentParse.push({
        name: arr[i - 2],
        ingradients: arr[i - 1],
        price: el,
      });
    }
  });
  console.log(documentParse);
}
getHtml();
// let array = [];
// function menuTree(tree) {
//   tree.map((el, index) => {
//     if (!el) console.log('null');
//     else if (!el.textContent) console.log('без контента');
//     else if (!el.textContent.trim()) console.log('пустая строка');
//     else {
//       array.push({
//         name: el.textContent,
//       });
//     }
//     el && el.children && menuTree(el.children);
//   });
// }
// menuTree(children);

// array = array.map((el, index, arr) => {
//   if (/[E€]/gi.test(el.name)) {
//     if (!arr[index - 1]) return;
//     return { name: arr[index - 1].name.replace(/(\r\n\t|\n|\r|\t)/gm, ''), price: el.name.replace(/(\r\n|\n|\r)/gm, '') };
//   }
// });
// // console.log(array.filter((el) => el !== undefined));
// console.log(array.filter((el) => el !== undefined).map((el, index, arr) => (isNaN(Number(el.price[4])) === true ? { ...el, name: el.price, price: el.name } : el)));
let TextElem = (e) => // parser html to json
  ({
    toJSON: () => ({
      type:
        e.nextElementSibling && e.nextElementSibling.tagName,
      textContent:
        e.textContent,
    }),
  });
let Elem = (e) => ({
  toJSON: () => ({
    type:
'Elem',
    tagName:
e.tagName,
    children:
Array.from(e.childNodes, fromNode),
  }),
});

// fromNode :: Node -> Elem
let fromNode = (e) => {
  console.log(1);
  switch (e.nodeType) {
    case 3: return TextElem(e);
    default: return Elem(e);
  }
};

// html2json :: Node -> JSONString
let html2json = (e) => JSON.stringify(Elem(e), null, '  ');
