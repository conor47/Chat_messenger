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

// note when we made changes to the model, eq we added password and imageURL fields we needed to re-run the migration.
// Since we are using a basic local database we simply undid the previous migration using the command
// sequelize db:migrate:undo and then we re-ran the migration using the command sequelize db:migrate
// this is not necessarily best practice as you must be careful when undoing migrations