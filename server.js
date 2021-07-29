// we need to get an instance of apollo server running

const { ApolloServer } = require("apollo-server");

// we destructure the instance of our sequelize database

const { sequelize } = require("./models");

// A map of functions which return data for the schema.
const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // the context object gives us access to important meta data relating to each request made on our server
  // this is necessary when modifying headers in request for performing user authentication etc
  context: (ctx) => ctx,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  //   we are connecting to our database instance

  sequelize
    .authenticate()
    .then(() => console.log("Database connected !"))
    .catch((err) => console.log(err));
});
