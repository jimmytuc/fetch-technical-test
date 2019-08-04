const routes = require('./routes');

const config = {
  routes,
  migrate: false,
  port: process.env.PORT || '3000',
};

module.exports = config;
