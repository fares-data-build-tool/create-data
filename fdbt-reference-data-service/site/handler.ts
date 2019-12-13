import { APIGatewayEvent, Callback, Context } from "aws-lambda";

export const hello = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello World!"
    })
  };
  callback(null, response);
};
