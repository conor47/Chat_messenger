'use strict';

// this model was created via the sequelize cli using the command :
// sequelize model:generate --name User --attributes username:string,email:string
// That command generated this file. 

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      email: {
        type: Sequelize.STRING,
        allowNull : false,
      },
      imageUrl : Sequelize.STRING,
      password: {
        type: Sequelize.STRING,
        allowNull : false,
        unique : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};