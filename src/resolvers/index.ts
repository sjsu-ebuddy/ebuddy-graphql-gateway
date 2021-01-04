import { IResolvers } from "apollo-server-express";
import logger from "../utils/logger";

const resolverMap: IResolvers = {
    Query: {
        root(): string {
            logger.info("Server is running.");
            return `Server is up.`;
        },
    },
    Mutation: {
        root(): string {
            logger.info("Server is running.");
            return `Server is up.`;
        }
    }
};

export default [resolverMap];
