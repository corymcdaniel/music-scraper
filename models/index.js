const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(module.filename);
const config = require('../config');
const db = {};

//HEROKU changes their db credentials periodically, but updates them
// in the DATABASE_URL environment variable
let sequelize = config.db.url ? new Sequelize(config.db.url, {logging: config.db.logging})
  : new Sequelize(config.db.database, config.db.username, config.db.password, config.db);

fs
  .readdirSync(__dirname)
  .filter(file =>
  (file.indexOf('.') !== 0) &&
  (file !== basename) &&
  (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;