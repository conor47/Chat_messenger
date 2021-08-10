// file containing our graphql resolvers

// we import the Users model

const { User, Message, Reaction } = require("../../models");
const { Op } = require("sequelize");
// we will use the pubsub class to create a pub sub subscription

const {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
  withFilter,
} = require("apollo-server");

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
          include: [{ model: Reaction, as: "reactions" }],
        });
        return messages;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  },
  Mutation: {
    sendMessage: async (parent, { to, content }, { user, pubsub }) => {
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

        pubsub.publish("NEW_MESSAGE", { newMessage: message });

        return message;
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    reactToMessage: async (_, { uuid, content }, { user, pubsub }) => {
      const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];
      try {
        // Validate the reaction content
        if (!reactions.includes(content)) {
          throw new UserInputError("Invalid reaction");
        }

        // Get user

        const username = user ? user.username : "";
        user = await User.findOne({ where: { username } });
        if (!user) throw new AuthenticationError("Unauthenticated");

        // Get message

        const message = await Message.findOne({ where: { uuid } });
        if (!message) throw new UserInputError("Message not found");

        if (
          message.from.toLowerCase() !== user.username &&
          message.to.toLowerCase() !== user.username
        ) {
          throw new ForbiddenError("Unauthorized");
        }

        let reaction = await Reaction.findOne({
          where: { messageId: message.id, userId: user.id },
        });

        if (reaction) {
          // reaction exists and so we update ut

          reaction.content = content;
          await reaction.save();
        } else {
          // reaction does not exist so we create it

          reaction = await Reaction.create({
            messageId: message.id,
            userId: user.id,
            content,
          });
        }

        pubsub.publish("NEW_REACTION", { newReaction: reaction });

        return reaction;
      } catch (err) {
        throw err;
      }
    },
  },
  Subscription: {
    newMessage: {
      // we wrap our resolver in a filter. The first arguement to the filter is the resolver. The second arguement
      // is a filter function. We will use this to return messages to a user that are from him or to him.
      // we do not want users to be able to access all messages
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          // we pass an arry of even,ts. When one of these events occur they will pass information to the
          // subscription. The subscription then passes that info to whoever is subscribed
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_MESSAGE");
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.username ||
            newMessage.to === user.username
          ) {
            return true;
          }
          return false;
        }
      ),
    },
    newReaction: {
      // we wrap our resolver in a filter. The first arguement to the filter is the resolver. The second arguement
      // is a filter function. We will use this to return messages to a user that are from him or to him.
      // we do not want users to be able to access all messages
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          // we pass an arry of even,ts. When one of these events occur they will pass information to the
          // subscription. The subscription then passes that info to whoever is subscribed
          if (!user) throw new AuthenticationError("Unauthenticated");
          return pubsub.asyncIterator("NEW_REACTION");
        },
        async ({ newReaction }, _, { user }) => {
          const message = await newReaction.getMessage();
          if (
            message.from === user.username.toLowerCase() ||
            message.to === user.username.toLowerCase()
          ) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
