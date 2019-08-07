/* eslint-disable camelcase */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-restricted-globals */
const httpStatusResponse = require('../helpers/http.response.status');
const Sequelize = require('sequelize');
const Validator = require('../models').Validator;
const { check, validationResult } = require('express-validator');

const validateCreateRequest = async (req) => {
  await check('validator_address')
    .isAlphanumeric()
    .withMessage('validator_address is required and must be a hashed string')
    .run(req);

  await check('public_key.type')
    .not().isEmpty()
    .withMessage('public_key.type is required')
    .run(req);

  await check('public_key.value')
    .not().isEmpty()
    .withMessage('public_key.value is required')
    .run(req);

  await check('validator_index')
    .isNumeric()
    .withMessage('validator_index is required and must be a numeric')
    .run(req);

  await check('voting_power')
    .isNumeric()
    .withMessage('voting_power is required and must be a numeric')
    .run(req);

  return validationResult(req);
};

const findInsertOrUpdate = async ({
  validator_address, public_key, validator_index, voting_power,
}) => {
  const validator = await Validator.findOne({
    where: Sequelize.or(
      {
        validatorAddress: validator_address,
      },
      {
        publicKeyType: public_key.type,
        publicKeyValue: public_key.value,
      },
    ),
  });

  let result = null;
  if (validator) {
    result = await validator.update({
      validatorIndex: validator.validatorIndex + 1,
      votingPower: validator.votingPower + (validator.votingPower % 10),
    });
  } else {
    result = await Validator.create({
      validatorAddress: validator_address,
      publicKeyType: public_key.type,
      publicKeyValue: public_key.value,
      validatorIndex: validator_index,
      votingPower: voting_power,
    });
  }

  return result;
};

const validatorController = () => {
  const create = async (req, res) => {
    const errors = await validateCreateRequest(req);
    if (!errors.isEmpty()) {
      return httpStatusResponse(res, 400, { errors: errors.array() });
    }

    try {
      const validator = await findInsertOrUpdate(req.body);

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
      } else if (limit > 50) {
        limit = 50;
      } else if (limit < 1) {
        limit = 1;
      }
      const offset = (page - 1) * limit;
      const validators = await Validator.findAndCountAll({
        offset,
        limit,
        where: { active: true },
      });

      return httpStatusResponse(res, 200, { total: validators.count, validators: validators.rows });
    } catch (err) {
      return httpStatusResponse(res, 500, { msg: 'Internal server error' });
    }
  };

  const getOne = async (req, res) => {
    const address = req.params.address;
    try {
      let validator = await Validator.findOne({
        where: {
          validatorAddress: address,
          active: true,
        },
      });

      if (!validator) {
        return httpStatusResponse(res, 404, { errors: `address: ${address} not found!` });
      }

      validator = validator.toJSON();
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
