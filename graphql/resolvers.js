// file containing our graphql resolvers

// we import the Users model

const { User } = require("../models");
const { JWT_SECRET } = require("../config/env.json");

// we use the bcrypt package for hashing the passwords

const bcrypt = require("bcryptjs");

// we will use jsonwebtokens for user authentication

const jwt = require("jsonwebtoken");

// we are importing sql operators. Sequelize provides a wrapper for these operators
const { Op } = require("sequelize");

const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    // we will be making using of the requst context to extract the jwt token stored in the http authorization
    // header. We will use to to verify the user making the request.

    getUsers: async (_, __, context) => {
      try {
        let user;

        if (context.req && context.req.headers.authorization) {
          const token = context.req.headers.authorization.split("Bearer ")[1];

          jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) {
              throw new AuthenticationError("Unauthenticated");
            }
            user = decodedToken;
          });
        }

        // here we are making use of sql operators , in this case not equal, to return all of the users not including
        // the user making the request.

        const users = await User.findAll({
          where: { username: { [Op.ne]: user.username } },
        });
        return users;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    // we write the login resolver. This involves some basic username and password authentication

    login: async (_, args) => {
      const { username, password } = args;
      let errors = {};
      try {
        if (username.trim() === "")
          errors.username = "username must not be empty";
        if (password === "") errors.username = "password must not be empty";

        if (Object.keys(errors).length > 0) {
          throw new UserInputError("bad input", { errors });
        }

        const user = await User.findOne({
          where: { username },
        });

        if (!user) {
          errors.username = "User not found";
          throw new UserInputError("user not found", { errors });
        }

        const correctPassword = await bcrypt.compare(password, user.password);

        if (!correctPassword) {
          errors.password = "Password is incorrect";
          throw new AuthenticationError("Password is incorrect", { errors });
        }

        // if we reach this point then the user is valid and will be logged in. We need to issue a jsonwebtoke
        // and send it back to the client

        const token = jwt.sign(
          {
            username,
          },
          JWT_SECRET,
          { expiresIn: 60 * 60 }
        );

        // instead of adding the token to the user object and returning that we make some modifications to the
        // returned object, namely we change the created at timestamp into a more readable form

        return {
          ...user.toJSON(),
          createdAt: user.createdAt.toISOString(),
          token,
        };
      } catch (err) {
        console.log(err);
        throw err;
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
