const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]
  }

  type Book {
    _id: ID
    bookId: String!
    authors: [String]
    description: String!
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    users: [User]
    user(_id: ID!): User
    me: User
  }

  type Mutation {
    addUser( username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(_id: ID!, bookId: String!, authors: [String], description: String!, title: String!, image: String, link: String): User
    removeBook(_id: ID!, bookId: String!): User
  }
`;

module.exports = typeDefs;
