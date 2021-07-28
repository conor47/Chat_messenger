

 // we need to get an instance of apollo server running 

const { ApolloServer } = require('apollo-server');

// we destructure the instance of our sequelize database

const { sequelize} = require('./models')


// A map of functions which return data for the schema.
const resolvers = require('./graphql/resolvers')
const typeDefs = require('./graphql/typeDefs')

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);

  sequelize.authenticate()
  .then(() => console.log("Database connected !"))
  .catch(err => console.log(err))
});