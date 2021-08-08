const userResolvers = require("./users");
const messageResolvers = require("./messages");

module.exports = {
  // here we are defining a new resolver for messages that allows us to perform transformations on returned messages

  // note we are using the parament arguement as any messages returned by top level resolvers (eg getMessages) will be run through
  // this resolver

  //  here we are specifying that the createdAt field in any returned message should be in ISO string format
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
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
