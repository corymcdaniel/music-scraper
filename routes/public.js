const _ = require('lodash');
const config = require('../config');
const runtimeRepository = require('../services/runtimeRepository');
const rateRepository = require('../services/rateRepository');
const scrapers = require('../scrapers');

module.exports = (app) => {
  app.route('/admin').get((req, res) => {

    Promise.all([
      runtimeRepository.lastRun(),
      rateRepository.getCurrent(req.query.currency),
      scrapers.getScrapers()
    ]).then(values => {
      _.forEach(values[1], rate => {
        rate.sourceName = _.result(
          _.find(config.constants.source, s => {
            return s.id === parseInt(rate.source)
          }), 'name');
      });

      _.forEach(values[0], runtime => {
        runtime.sourceName = _.result(
          _.find(config.constants.source, s => {
            return s.id === parseInt(runtime.source)
          }), 'name');
      });

      let sources = values[2].map(s => {
        return {name: s, value: s.toLowerCase()};
      });

      return res.render("index", {
        runs: values[0] || [],
        latestRates: values[1] || [],
        sources,
        currency: req.query.currency
      });
    });
  });
};
