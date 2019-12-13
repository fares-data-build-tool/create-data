import * as handler from "../handler";
import { Context, Callback, APIGatewayEvent } from "aws-lambda";
import MockContext from "aws-lambda-mock-context";
const createEvent = require('aws-event-mocks');

describe("aws handler", () => {
  it("should call callback with a response", () => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: "Hello World!"
        })
      };
      const event: APIGatewayEvent = createEvent({
        template: 'aws:apiGateway',
        merge: {
          body: {}
        }
      });
    const context: Context = MockContext();
    const callback: Callback = jest.fn();
    handler.hello(event, context, callback);
    expect(callback).toHaveBeenCalledWith(null, response);
  });
});
