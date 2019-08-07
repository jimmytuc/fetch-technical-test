/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Validators', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
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
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    votingPower: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Validators'),
};
