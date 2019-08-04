/* eslint-disable no-unused-vars */
const Sequelize = require('sequelize');
const sequelize = require('../../configs/database');

const hooks = {
  beforeCreate(_validator) {

  },
  afterCreate(_validator) {

  },
};

const tableName = 'validators';
const Validator = sequelize.define('Validator', {
  validatorAddress: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  publicKeyType: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  publicKeyValue: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  validatorIndex: {
    type: Sequelize.INTEGER(10),
    allowNull: false,
  },
  votingPower: {
    type: Sequelize.INTEGER(10),
    allowNull: false,
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
}, { hooks, tableName });

// eslint-disable-next-line func-names
Validator.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  const transformedPublicKey = {
    publicKey: {
      type: values.publicKeyType,
      value: values.publicKeyValue,
    },
  };
  delete values.id;
  delete values.publicKeyType;
  delete values.publicKeyValue;
  return Object.assign(values, transformedPublicKey);
};

module.exports = Validator;
