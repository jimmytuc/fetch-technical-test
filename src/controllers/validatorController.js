/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
const httpStatusResponse = require('../helpers/http.response.status');
const Validator = require('../models/validator');
const { check, validationResult } = require('express-validator');

const validateCreateRequest = async (req) => {
  await check('validator_address')
    .isAlphanumeric()
    .isLength({ min: 40 })
    .withMessage('`validator_address` is required and must be a hashed string')
    .run(req);

  await check('public_key_type')
    .withMessage('`public_key_type` is required')
    .run(req);

  await check('public_key_value')
    .withMessage('`public_key_value` is required')
    .run(req);

  await check('validator_index')
    .isNumeric()
    .withMessage('`validator_index` is required and must be a numeric')
    .run(req);

  await check('voting_power')
    .isNumeric()
    .withMessage('`voting_power` is required and must be a numeric')
    .run(req);

  return validationResult(req);
};


const validatorController = () => {
  const create = async (req, res) => {
    const errors = await validateCreateRequest(req);
    if (!errors.isEmpty()) {
      return httpStatusResponse(res, 400, { errors: errors.array() });
    }

    try {
      const {
        validator_address, public_key_type, public_key_value, validator_index, voting_power,
      } = req.body;
      const validator = await Validator.create({
        validatorAddress: validator_address,
        publicKeyType: public_key_type,
        publicKeyValue: public_key_value,
        validatorIndex: validator_index,
        votingPower: voting_power,
      });

      return httpStatusResponse(res, 200, { validator });
    } catch (err) {
      return httpStatusResponse(res, 500, { msg: 'Internal server error' });
    }
  };

    /**
     * return list with pagination
     * @param {*} req
     * @param {*} res
     */
  const getAll = async (req, res) => {
    try {
      let page = parseInt(req.query.page, 10);
      if (isNaN(page) || page < 1) {
        page = 1;
      }
      let limit = parseInt(req.query.limit, 10);
      if (isNaN(limit)) {
        limit = 10;
      } else if (limit > 100) {
        limit = 100;
      } else if (limit < 1) {
        limit = 1;
      }
      const offset = (page - 1) * limit;
      const validators = await Validator.findAll({
        paginate: {
          offset,
          limit,
        },
      });

      return httpStatusResponse(res, 200, { validators });
    } catch (err) {
      return httpStatusResponse(res, 500, { msg: 'Internal server error' });
    }
  };

  const getOne = async (req, res) => {
    const address = req.params.address;
    try {
      const validator = await Validator.findOne({
        where: {
          validatorAddress: address,
        },
      });

      if (!validator) {
        return httpStatusResponse(res, 404, { errors: `address: ${address} not found!` });
      }

      return httpStatusResponse(res, 200, { validator });
    } catch (err) {
      return httpStatusResponse(res, 500, { msg: 'Internal server error' });
    }
  };

  return {
    create,
    getAll,
    getOne,
  };
};

module.exports = validatorController;
