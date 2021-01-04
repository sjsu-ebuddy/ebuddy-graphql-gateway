import "reflect-metadata";
import path from "path";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { ApolloServer } from "apollo-server-express";
import session from "express-session";
import connectRedis from "connect-redis";
import schema from "./schema";
import { AppContext } from "./types";
import rateLimit from "express-rate-limit";
import { env, SessionConstants, config } from "./utils/constants";
import logger from "./utils/logger";
import { Redis } from "ioredis";

if (process.env.NODE_ENV) {
    dotenv.config({
        path: path.join(process.cwd() + `/environments/${process.env.NODE_ENV}.env`)
    });
} else {
    logger.error("Node environment not set.");
    process.exit(1);
}

class App {

    app: express.Application;
    apolloServer: ApolloServer;

    constructor(redis: Redis) {
        this.app = express();
        this.apolloServer = new ApolloServer({
            schema,
            context: ({ req, res }: AppContext) => ({
                req,
                res
            }),
        });
        this.loadMiddleware(redis);
    }

    private loadMiddleware(redis: Redis) {
        this.app.use(helmet({
            contentSecurityPolicy: (process.env.NODE_ENV === env.PROD) ? undefined : false
        }));
        this.app.use("*", cors());
        this.app.use(compression());
        this.app.use("*", rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 200
        }));

        // session related middleware
        const RedisStore = connectRedis(session);
        this.app.use(
            session({
                store: new RedisStore({
                    client: redis,
                    prefix: SessionConstants.PREFIX
                }),
                name: SessionConstants.COOKIE_NAME,
                secret: process.env.SESSION_SECRET || config.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === env.PROD,
                    maxAge: 1000 * 60 * 60 * 24 * 5 // 5 days
                }
            })
        );
        this.apolloServer.applyMiddleware({ app: this.app });
    }

    serve(port: number, host: string, cb: () => void): void {
        this.app.listen(port, host, cb);
    }

}


export default App;