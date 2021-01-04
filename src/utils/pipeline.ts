import { AppContext } from "../types";
import logger from "./logger";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Context {
    response: any;
    pipelineName: string;
    error: string;
    [key: string]: any;
}

export interface PipelineInput {
    args: any;
    appContext: AppContext;
    [key: string]: any;
}

export type HandlerFunction = ((context: Context, data: PipelineInput) => Promise<void>);

type Handler = (HandlerFunction | HandlerFunction[]);

class Pipeline {
    private handlers: Handler[];
    name: string;

    /**
     * Creates a pipeline object.
     * @param handlers List of HandlerFunctions for execution. 
     * If a HandlerFunction array is passed, they're executed parallelly.
     * @param name Pipeline Name, used for logging and is available in context.
     */
    constructor(handlers: Handler[], name: string) {
        this.handlers = handlers;
        this.name = name;
    }

    add(handler: Handler): Pipeline {
        this.handlers.push(handler);
        return this;
    }

    /**
     * 
     * @param input accepts pipeline input object which can be null
     */
    async execute(input: PipelineInput | null): Promise<any> {
        logger.info(`starting ${this.name} pipeline`);
        const context: Context = {
            response: null,
            pipelineName: this.name,
            error: ""
        };
        try {
            for (const handler of this.handlers) {
                if (!Array.isArray(handler)) {
                    logger.info(`executing ${handler.name}`);
                    await handler(context, input);
                    logger.info(`completed ${handler.name}`);
                } else {
                    const handlerPromises: Promise<void>[] = [];
                    let handlerNames = "";
                    for (const handle of handler) {
                        handlerNames += `${handle.name} `;
                        handlerPromises.push(handle(context, input));
                    }
                    logger.info(`executing ${handlerNames}in parallel`);
                    await Promise.all(handlerPromises);
                    logger.info(`completed parallel step`);
                }
            }
            return Promise.resolve(context.response);
        } catch (err) {
            logger.error(context.error);
            throw new Error(context.error);
        }
    }

}

export default Pipeline;
