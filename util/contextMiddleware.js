const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");
const { PubSub } = require("apollo-server");

const pubsub = new PubSub();

// here we are defining a piece of middleware. This middleware will be run on every request. It will fetch the token
// for current user and populate the user field in the context body and forward it to the resolver. The resolver
// will then determine what to do with that data

module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split("Bearer ")[1];
    // if the inbound request is part of a subscription it will take place via web sockets. Thus we cannot
    // get the authorization header as we did above. The web sockets connection object has its own context that
    // we can access
  } else if (context.connection && context.connection.context.Authorization) {
    token = context.connection.context.Authorization.split("Bearer ")[1];
  }
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // the reason we do not throw an error here is since this is middleware this runs on all inbound requests and there
        // are actions that do not require authentication so we do not just blindly want to throw an error`
        // throw new AuthenticationError("Unauthenticated");
      }
      context.user = decodedToken;
    });
  }

  // adding the pubsub to the context allows us to retrieve it from the context when we need it

  context.pubsub = pubsub;

  return context;
};
