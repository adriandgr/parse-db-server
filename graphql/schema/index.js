const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    _id: ID!
    email: String!
    password: String
    confirmedEmail: Boolean 
}

input UserInput {
    email: String!
    password: String!
}

type AuthData {
  userId: ID!
  token: String!
  tokenExp: Int!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    users: [User!]!
}

type RootMutation {
    createUser(userInput: UserInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);