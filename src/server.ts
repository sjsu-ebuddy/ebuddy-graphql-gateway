import { config } from "./utils/constants";
import App from "./App";
import log from "./utils/logger";
import redis from "./utils/redis";

const bootstrap = () => {
    const gatewayApp = new App(redis);
    const port = parseInt(process.env.PORT) || config.PORT;
    const host = process.env.HOST || config.HOST;
    gatewayApp.serve(port, host, () => {
        log.info(`Gateway App started on http://${host}:${port}`);
    });
};

bootstrap();
