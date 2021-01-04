import Pipeline, {HandlerFunction, Context} from "./pipeline";

describe("Pipeline tests", () => {
    
    let pipeline: Pipeline;

    beforeEach(() => {
        pipeline = new Pipeline([], "TEST_PIPELINE");
    });

    it("Should execute handlers in sequence when passed in sequence", async () => {
        const handler1: HandlerFunction = jest.fn((context: Context) => {
            context.response = "response from handler 1";
            return Promise.resolve();
        });
        const handler2: HandlerFunction = jest.fn((context: Context) => {
            context.response = "response from handler 2";
            return Promise.resolve();
        });

        pipeline.add(handler1).add(handler2);
        
        const result = await pipeline.execute(null);

        expect(result).toEqual("response from handler 2");
        expect(handler1).toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();
    });

    it("Should execute handlers in parallel when an array is passed", async () => {
        const handler1: HandlerFunction = jest.fn(() => {
            return Promise.resolve();
        });

        const handler2: HandlerFunction = jest.fn((context: Context) => {
            context.response = "response from handler 2";
            return Promise.resolve();
        });

        pipeline.add([handler1, handler2]);
        
        const result = await pipeline.execute(null);

        expect(result).toEqual("response from handler 2");
        expect(handler1).toHaveBeenCalled();
        expect(handler2).toHaveBeenCalled();

    });

    it("Should throw right error when a handler promise rejects", async () => {
        const handler1: HandlerFunction = jest.fn((context: Context) => {
            context.error = "test error";
            return Promise.reject();
        });

        pipeline.add(handler1);
        let result, error;
        try {
            result = await pipeline.execute(null);
        } catch(err) {
            error = err.message;
        }

        expect(result).toBe(undefined);
        expect(error).toEqual("test error");
    });
});