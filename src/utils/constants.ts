export const config = Object.freeze({
    PORT: 8080,
    HOST: "0.0.0.0",
    SESSION_SECRET: "$super_secret$"
}); 

export const env = Object.freeze({
    PROD: "production",
    DEV: "development",
    QA: "test"
});

export const SessionConstants = Object.freeze({
    PREFIX: "EB_SESS-",
    COOKIE_NAME: "sid"
});