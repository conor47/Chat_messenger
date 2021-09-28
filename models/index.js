'use strict';

// very generally what this file is doing is importing the config from the config.json file. It then starts a new
// instance of the library sequelize , the ORM, using the username , database, password etc that we gave it in the config file
// it exports Sequelize for the package itself and sequelize for the instance of the database

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.js');
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// the below piece of code uses the file system package and traverse the entire models folder and gets all of the models
// and imports them and then initialises the sequelize instance with them

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
