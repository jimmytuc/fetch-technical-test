/* eslint-disable func-names */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const hooks = {
  beforeCreate(_validator) {

  },
  afterCreate(_validator) {

  },
};

const tableName = 'Validators';
const defaultScope = {
  attributes: {
    exclude: ['active', 'createdAt', 'updatedAt'],
  },
};

module.exports = (sequelize, DataTypes) => {
  const Validator = sequelize.define('Validator', {
    validatorAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicKeyType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publicKeyValue: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    validatorIndex: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    votingPower: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, { hooks, tableName, defaultScope });

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

  return Validator;
};
