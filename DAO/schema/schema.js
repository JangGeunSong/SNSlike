const { gql } = require('apollo-server-express');

module.exports =  typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # Define article type
  type Article {
    _id: ID!
    title: String!
    writer: User!
    date: String!
    description: String!
  }

  # Define user type
  type User {
    _id: ID!
    name: String!
    email: String!
    password: String
    profile_image: String
    profile: String
    created_articles: [Article]
  }

  # Define Authentication type
  type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
  }

  # Define Query type
  type Query {
    articles: [Article]
    users: [User]
  }

  # Define userInput
  input UserInput {
    name: String!
    email: String!
    password: String!
    profile_image: String
    profile: String
  }

  # Define articleInput
  input ArticleInput {
    title: String!
    description: String!
    writer: String!
  }

  # Define loginInput
  input LoginInput {
    email: String!
    password: String!
  }

  # Define Mutation
  type Mutation {
    createUser(userInput: UserInput): User
    createArticle(articleInput: ArticleInput): Article
    deleteArticle(articleId: ID!): Article
    login(loginInput: LoginInput!): AuthData
  }

`;