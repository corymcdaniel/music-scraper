const winston = require('winston');
const config = require('../config');
const request = require('request-promise-native');

const logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true,
      silent: config.quietLogging
    }),
  ]
});

logger.on('logging', (transport, level, msg, meta) => {
  if ((config.sendOnlyErrors && level !== 'error') || !config.sendSlackAlerts) {
    return;
  }

  request({
    method: 'post',
    url: config.apis.slack.webhookUrl,
    body: {
      username: 'Scraper Bot', text: `${msg} - ${JSON.stringify(meta)}`,
    },
    json: true,
  })
    .catch(err => {
      console.error(err);
    });
});

module.exports = logger;