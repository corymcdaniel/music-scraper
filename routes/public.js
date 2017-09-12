const _ = require('lodash');
const config = require('../config');
const scrapers = require('../scrapers');

module.exports = (app) => {
  app.route('/admin').get((req, res) => {
      return res.render("index", {
      });
    });
};
