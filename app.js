const path = require('path');
const express = require('express');
const compress = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const flash = require('express-flash');
const expressValidator = require('express-validator');
const partials = require('express-partials');
const multer = require('multer');
const config = require('./config');
const cors = require('cors');
const models = require('./models');
const log = require('./services/logger');

global.appRoot = path.resolve(__dirname);

let app = express();

app.set('port', process.env.PORT || config.port || 3000);

let whitelist = ['http://localhost:8080', 'http://localhost:3000'];
let corsOptions = {
  origin: function(origin, callback){
    let originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));
app.set("view engine", "ejs");
app.use(partials());
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

require('./routes/api_v1')(app);
require('./routes/public')(app);

/**
 * Error Handler.
 */
app.use(function (err, req, res, next) {
  //TODO: error handle
  log.error(err);
  next();
});

if (process.env.NODE_ENV !== 'production') {
  app.use(errorHandler());
}
// Bootstrap db connection
models.sequelize.sync().then(() => {
  app.listen(app.get('port'), function () {
    log.info('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
    require('./scrapers')();
  });
});

module.exports = app;
