module.exports = {
  env: 'development',
  db: {
    username: '',
    password: null,
    database: 'music-equipment',
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    logging: true,
  },
  port: 3300,
  quietLogging: false,
  sendSlackAlerts: false,
  sendOnlyErrors: false,
  apis: {

  }
};
