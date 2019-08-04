const routes = {
  'POST /validators': 'ValidatorController.create',
  'GET /validators/:address': 'ValidatorController.getOne',
  'GET /validators': 'ValidatorController.getAll',
};

module.exports = routes;
