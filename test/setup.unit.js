const sinon = require('sinon');

/*** GLOBAL HOOKS ***/
before(() => {
  console.log('Beginning tests\n\n');
  //hook up sinon promises
  //require('sinon-as-promised');
});

after(() => {
  console.log('\nFinished tests\n');
});
