const {gql} = require('apollo-server')

module.exports =  gql`

# we define a new type , User, each of which contains a username and email, each of which are required

type User{
    username:String!
    email:String! 
}

# here we are specifying that this getUsers query must return an array, even if it's empty, of User only objects  

  type Query {
    getUsers: [User]!
  }
`;