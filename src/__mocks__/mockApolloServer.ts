import { ApolloServer } from "apollo-server-express";
import schema from "../schema";

export const getMockApolloServer = (context: any): ApolloServer => {
    const server = new ApolloServer({
        schema,
        context
    });

    return server;

};