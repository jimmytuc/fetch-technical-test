const routes = require('./routes');

const config = {
  routes,
  migrate: true,
  port: process.env.PORT || '3000',
};

module.exports = config;
