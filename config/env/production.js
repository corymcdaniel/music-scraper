module.exports = {
  env: 'production',
  db: {
    username: '',
    password: null,
    database: 'music-equipment',
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    logging: false,
  },
  quietLogging: false,
  sendSlackAlerts: true,
  sendOnlyErrors: false,
  port: 8080
};