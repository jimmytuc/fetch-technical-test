const bodyParser = require('body-parser');
const express = require('express');
const helmet = require('helmet');
const http = require('http');
const mapRoutes = require('express-routes-mapper');
const cors = require('cors');

const config = require('../configs/');
const dbService = require('./services/db.service');

const environment = process.env.NODE_ENV || 'development';

const app = express();
const server = http.Server(app);
const mainRoutes = mapRoutes(config.routes, 'src/controllers/');
const DB = dbService(environment, config.migrate).start();

/**
 * middlewares
 */
app.use(cors());
app.use(helmet({
  dnsPrefetchControl: false,
  frameguard: false,
  ieNoOpen: false,
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/v1', mainRoutes);
app.all('*', (req, res) => res.status(404).send({
  message: 'The requested to unavailable resource.',
}));

server.listen(config.port, () => {
  if (environment !== 'production' &&
    environment !== 'development'
  ) {
    // eslint-disable-next-line no-console
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
