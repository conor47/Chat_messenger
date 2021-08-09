const userResolvers = require("./users");
const messageResolvers = require("./messages");

const { User, Message } = require("../../models");

module.exports = {
  // here we are defining a new resolver for messages that allows us to perform transformations on returned messages

  // note we are using the parament arguement as any messages returned by top level resolvers (eg getMessages) will be run through
  // this resolver

  //  here we are specifying that the createdAt field in any returned message should be in ISO string format
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    // here we are resolving some of the individual fields in a message type
    createdAt: (parent) => parent.createdAt.toISOString(),
    Message: async (parent) => await Message.findByPk(parent.messageId),
    User: async (parent) =>
      await User.findByPk(parent.userId, {
        attributes: ["username", "createdAt", "imageUrl"],
      }),
  },
  Query: {
    ...userResolvers.Query,
    ...messageResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...messageResolvers.Mutation,
  },
  Subscription: {
    ...messageResolvers.Subscription,
  },
};
