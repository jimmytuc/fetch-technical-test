const bodyParser = require('body-parser');
const express = require('express');
const mapRoutes = require('express-routes-mapper');
const config = require('../../configs/');
const database = require('../../configs/database');

const beforeAction = async () => {
  const testApp = express();
  const mainMappedRoutes = mapRoutes(config.routes, 'src/controllers/');
  testApp.use(bodyParser.urlencoded({ extended: false }));
  testApp.use(bodyParser.json());
  testApp.use('/v1', mainMappedRoutes);

  await database.authenticate();
  await database.drop();
  // eslint-disable-next-line no-console
  await database.sync().then(() => console.log('Connection to the database has been established successfully'));
  return testApp;
};

const afterAction = async () => {
  await database.close();
};

module.exports = { beforeAction, afterAction };
