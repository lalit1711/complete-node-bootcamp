const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

//Blocking, synchronous way
// const textIn  = fs.readFileSync("../1-node-farm/starter/txt/input.txt", "utf-8");
// console.log(textIn);

// const textOut = `This is What we know about avacado: ${textIn}.\n Created on ${Date.now()}`;

// fs.writeFileSync("../1-node-farm/starter/txt/input.txt", textOut);
// console.log("File Written");

//Non-blocking, asu=ynchronous way
// fs.readFile("../1-node-farm/starter/txt/start.txt", "utf-8", (err, data1) => {
//     if(err) return console.log("Error")
//     fs.readFile(`../1-node-farm/starter/txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log({data2});
//         fs.readFile(`../1-node-farm/starter/txt/append.txt`, "utf-8", (err, data3) => {
//             console.log({data3});
//             fs.writeFile(`../1-node-farm/starter/txt/final.txt`, `${data2}\n${data3}`, "utf-8", err => {
//                 console.log("Your file has been written")
//             })
//         });
//     });
// });

// console.log("Will read this")

////////////////////////////////////****************SERVER***************//////////////////////////////////////////////////////////////////
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  //overview page
  if (pathname === '/overview' || pathname === '/') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const cardsHTML = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML);
    res.end(output);
  }
  //product page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObj[query?.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'text/json',
      'my-own-header': 'API',
    });
    res.end(data);
  }
  // Not Found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': '404 not found',
    });
    res.end('<h1>Page Not Found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to request on port 8000');
});
