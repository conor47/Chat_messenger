// file containing our graphql type definitions

const { gql } = require("apollo-server");

module.exports = gql`
  # we define a new type , User, each of which contains a username and email, each of which are required

  type User {
    username: String!
    email: String
    createdAt: String!
    token: String
    imageUrl: String
    latestMessage: Message
  }
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }

  type Reaction {
    uuid: String!
    content: String!
    createdAt: String!
    Message: Message!
    User: User!
  }

  type Query {
    # here we are specifying that this getUsers query must return an array, even if it's empty, of User only objects

    getUsers: [User]!
    login(username: String!, password: String!): User!
    getMessages(from: String!): [Message]!
  }

  type Mutation {
    # we define a mutation for handling registrations

    register(
      username: String!
      email: String!
      password: String!
      confirmPassword: String!
    ): User!
    sendMessage(to: String!, content: String!): Message!
    reactToMessage(uuid: String!, content: String!): Reaction!
  }

  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;
