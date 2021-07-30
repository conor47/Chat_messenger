const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env.json");

// here we are defining a piece of middleware. This middleware will be run on every request. It will fetch the token
// for current user and populate the user field in the context body and forward it to the resolver. The resolver
// will then determine what to do with that data

module.exports = (context) => {
  if (context.req && context.req.headers.authorization) {
    const token = context.req.headers.authorization.split("Bearer ")[1];

    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        // the reason we do not throw an error here is since this is middleware this runs on all inbound requests and there
        // are actions that do not require authentication so we do not just blindly want to throw an error`
        // throw new AuthenticationError("Unauthenticated");
      }
      user = decodedToken;
      context.user = decodedToken;
    });
  }
  return context;
};
