// file containing our graphql resolvers

// we import the Users model

const { User, Message } = require("../../models");
const { Op } = require("sequelize");

const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
  Query: {
    getMessages: async (parent, { from }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");

        const otherUser = await User.findOne({
          where: { username: from },
        });

        if (!otherUser) {
          throw new UserInputError("User not found");
        }

        // If we reach this point then we need to run a sql query that fetches all messages between the two users

        const usernames = [user.username, otherUser.username];

        const messages = await Message.findAll({
          where: {
            from: { [Op.in]: usernames },
            to: { [Op.in]: usernames },
          },
          //   order is an array or arrays where each array represents a key in the ordering. Here we are specifying that we
          // want to order the results by cratedAt in descending order
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("Unauthenticated");
        // once we pass here we know the user is a valid user / has a valid token

        const recipient = await User.findOne({ where: { username: to } });

        // here we check to see if the recipient exists. We also check to see if the recipient is the
        // the same user as the user sending the message.

        if (!recipient) {
          throw new UserInputError("User not found");
        } else if (recipient.username === user.username) {
          throw new UserInputError("You can't message yourself");
        }
        // if we get here then the recipient exists. We want to persist the message in the database

        if (content.trim() === "") {
          throw new UserInputError("Message is empty");
        }

        const message = await Message.create({
          from: user.username,
          to,
          content,
        });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
};
