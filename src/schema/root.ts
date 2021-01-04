import {ITypeDefinitions, ITypedef, gql} from "apollo-server-express";
import IdentitySchema from "./identity";

const root: ITypedef = gql`
    type Query {
        root: String
    }

    type Mutation {
        root: String
    }
`;

const typeDefs: ITypeDefinitions = [
    root,
    IdentitySchema
];

export default typeDefs;
