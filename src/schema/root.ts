import {ITypeDefinitions, ITypedef, gql} from "apollo-server-express";

const root: ITypedef = gql`
    type Query {
        root: String
    }

    type Mutation {
        root: String
    }
`;

const typeDefs: ITypeDefinitions = [
    root
];

export default typeDefs;
