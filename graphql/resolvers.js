// file containing our graphql resolvers

// we import the Users model

const { User } = require("../models");

// we use the bcrypt package for hashing the passwords

const bcrypt = require("bcryptjs");

//

const { UserInputError } = require("apollo-server");

module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    register: async (_, args) => {
      let { username, email, password, confirmPassword } = args;
      // we create an errors object. If there are any errors we add them to the object, throw them and return them to
      // the client
      let errors = {};

      try {
        // TODO Validate user input

        // we perform some crude input validation

        if (email.trim() === "") errors.email = "Email must not be empty";
        if (username.trim() === "")
          errors.username = "Username must not be empty";
        if (password.trim() === "")
          errors.password = "Password must not be empty";
        if (confirmPassword.trim() === "")
          errors.confirmPassword = "Confirm Password must not be empty";

        if (password !== confirmPassword)
          errors.confirmPassword = "Passwords must match";

        // TODO Check if username / email exists

        // the findOne method will search for for entires in the user table matching some criteria that we pass in
        // if a match is found then the entry is returned, if not then null is returned

        // we can use the below indented block for checking whether the email and username already exist in the database
        // however this is a more inefficient method. We already have built in unique validation checking for the email
        // and password fields as defined in our models.

        // const userByUsername = await User.findOne({ where: { username } });
        // const userByEmail = await User.findOne({ where: { email } });

        // if (userByUsername) errors.username = "Username is taken";
        // if (userByEmail) errors.email = "Email is taken";

        // we check to see if there are any errors in the errors object, if there are then we throw the errors object
        // and it will be caught in the catch block

        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        //  Hash password

        password = await bcrypt.hash(password, 6);

        //  Create User

        // this user object holds additional methods but when we return it it automatically runs the toJSON() method
        // returning to us a json representation of the object

        const user = await User.create({
          username,
          email,
          password,
        });

        // TODO Return user

        return user;
      } catch (err) {
        console.log(err);

        // the error checking for unique username and emails is now done here. If the User.create() method above throws
        // a UniqueConstraintError we handle it below

        if (err.name === "SequelizeUniqueConstraintError") {
          err.errors.forEach(
            (e) => (errors[e.path] = `${e.path} is already taken`)
          );
        } else if (err.name === "SequelizeValidationError") {
          err.errors.forEach((e) => (errors[e.path] = e.message));
        }
        throw new UserInputError("Bad Input", { errors });
      }
    },
  },
};
