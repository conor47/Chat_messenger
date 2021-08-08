"use strict";

// this model was created via the sequelize cli using the command :
// sequelize model:generate --name User --attributes username:string,email:string
// That command generated this file

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  // two arguements are passed to the init fuction. The first is an object containing our field definitions. The second
  // is an object containing options for the model

  User.init(
    {
      // we define a new id column. We specify that it is an integer of 11 digits, non nullable, is set to autoincrement and
      // is the primary key. Note this was not necessary as an id field is actually defined in the migrations.

      // id : {
      //   type : DataTypes.INTEGER(11),
      //   allowNull : false,
      //   autoIncrement : true,
      //   primaryKey : true,
      // },

      // be default fields are nullable. Below we are specifying that username and email fields are non nullable and unique

      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // here we use the validate key and supply validation rules as values. There are pre-defined validation rules
        // provided by sequelize
        validate: {
          isEmail: {
            args: true,
            msg: "Must be a valid email address",
          },
        },
      },

      // we add a field for passwords

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // we add a field for user image urls. We will not be handling image uploads, just urls to existing images on
      // the internet

      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      // be default the table name will be Users but we can overwrite that
      tableName: "users",
    }
  );
  return User;
};
