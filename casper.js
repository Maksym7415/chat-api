// casper js
// spooky need to run casper js in nodejs environment

let Spooky = require('spooky');

module.exports = () => new Spooky({
    child: {
      command: './node_modules/casperjs/bin/casperjs.exe',
      transport: 'http',
    },
    casper: {
      logLevel: 'debug',
      verbose: true,
    },
  }, ((err) => {
    if (err) {
      let e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }
  
    spooky.start(
      'http://en.wikipedia.org/wiki/Spooky_the_Tuff_Little_Ghost',
    );
    spooky.then(function () {
      this.emit('hello', `Hello, from ${this.evaluate(() => console.log(123))}`);
    });
    spooky.run();
  }));
