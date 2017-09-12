const request = require('request-promise-native');
const cheerio = require('cheerio');
const async = require('async');

const perPageAmt = 30;
const baseUri = 'http://www.guitarcenter.com/';
const uri = `${baseUri}Keyboards-MIDI.gc?N=18185+1075`;

module.exports = () => {
  let options = {
    uri,
    transform: body => cheerio.load(body)
  };

  return request(options).then($ => {
    let pages = $('#searchPaginationBottom a');
    let numPages = parseInt($(pages[pages.length - 2]).text());
    console.log(numPages);
    let urls = [];
    for (let i = 0; i < numPages; i++) {
      urls.push(`${uri}&Nao=${perPageAmt * i}`);
    }
    return urls;
  }).then(urls => {
    return new Promise((resolve) => {
      let productUrls = [];
      async.eachLimit([urls[0]], 10, (url, next) => {
        console.log(url);
        let options = {
          uri: url,
          transform: body => cheerio.load(body)
        };

        request(options).then($ => {
          $('#resultsContent .product .productTitle a').toArray().forEach(anchor => {
            productUrls.push($(anchor).attr('href'));
          });
          next();
        })
      }, err => {
        if (err) {
          console.error(err);
        }
        resolve(productUrls);
      });
    });
  })
    .then(productUrls => {
      return new Promise(resolve => {
        let titles = [];
        async.eachLimit(productUrls, 10, (url, nextProduct) => {
          console.log('querying ' + url);
          let options = {
            uri: `${baseUri}${url}`,
            transform: body => cheerio.load(body)
          };
          request(options).then($ => {
            titles.push($('.topInfo .brand').text());
            nextProduct();
          });

        }, err => {
          if (err) {
            console.log(err);
          }
          resolve(titles);
        });
      });
    }).then(titles => {
      titles.forEach(title => {
        console.log(title);
      });
    });
};