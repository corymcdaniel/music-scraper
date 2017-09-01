const scrapeController = require('../controllers/scrape');

module.exports = function(app) {
  app.route('/v1/healthcheck').get((req, res) => {
      return res.status(200).send('All Good.');
  });

  app.route('/v1/scrape').post(scrapeController.scrape);
};
