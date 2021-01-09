import { getMockApolloServer } from "../__mocks__/mockApolloServer";
import { createTestClient, ApolloServerTestClient } from "apollo-server-testing";
import {gql} from "apollo-server-express";
import logger from "../utils/logger";

const createRootMutation = gql`
    mutation {
        root
    }
`;

const rootQuery = gql`
    query Root {
        root
    }
`;


describe ("Root Resolvers", () => {

    describe("RootResolvers mutation", () => {
        let testApolloClient: ApolloServerTestClient;
        let mockContext; 
        beforeAll( () => {
            mockContext = () => ({
                req: {},
                res: {}
            }); 
            testApolloClient = createTestClient(getMockApolloServer(mockContext))
        });

        it("Should create the root mutation", async() => {
            const { data, errors } = await testApolloClient.mutate({
                mutation: createRootMutation,
            });
            expect(errors).toBeFalsy();
            expect(data.root).toBeTruthy();
            expect(data.root).toEqual("Server is up.");
            logger.info(data);
        });


    });
    describe("RootResolver Query", () => {
        

        it("Should create the root query", async () => {
            const mockContext = () => ({
                req: {},
                res: {}
            });
            const testApolloClient = createTestClient(getMockApolloServer(mockContext));

            const { data, errors } = await testApolloClient.query({
                query: rootQuery
            });

            expect(errors).toBeFalsy;
            expect(data.root).toBeTruthy;
            expect(data.root).toEqual("Server is up.");
            logger.info(data.root);
        });

    });


});