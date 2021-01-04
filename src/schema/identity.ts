import { ITypedef, gql } from "apollo-server-express";


const IdentitySchema: ITypedef = gql`
    type User {
        email: String!
        password: String
        firstName: String
        lastName: String
    }

    input CreateUserInput {
        email: String!
        password: String!
        firstName: String
        lastName: String
    }

    input LoginInput {
        email: String!
        password: String!
    }

    extend type Mutation {
        createUser(user: CreateUserInput!): User
        login(credentials: LoginInput!): User
        logout: Boolean
    }

    extend type Query {
        me: User
    }
`;

export default IdentitySchema;
