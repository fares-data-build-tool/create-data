import service from "../../../pages/api/service";
import { mockRequest, mockResponse } from "mock-req-res";
import { OPERATOR_COOKIE, SERVICE_COOKIE } from "../../../constants";

describe("service", () => {

  beforeEach( () => {
    jest.resetAllMocks();
  });

  it("should return 302 redirect to /stages when the session is valid AND a service cookie exists", () => {
    const writeHeadMock = jest.fn();
    const req = mockRequest({
      connection: {
        encrypted: false
      },
      body: {},
      headers: {
        "set-cookie": [],
        "Set-cookie": [],
        host: "localhost:5000",
        cookie: `${SERVICE_COOKIE}=%7B%22service%22%3A%22N1%22%2C%22uuid%22%3A%22d177b8a0-44ed-4e67-9fd0-2d581b5fa91a%22%7D`
      }
    });
    const res = mockResponse({ 
      writeHead: writeHeadMock
    });
    service(req, res);
    expect(writeHeadMock).toBeCalledWith(302, {
      Location: '/stages'
    });
  });

  it("should return 302 redirect to /stages when the session is valid, there is not service cookie BUT one can be set", () => {
    const writeHeadMock = jest.fn();
    const req = mockRequest({
      connection: {
        encrypted: false
      },
      body: {SERVICE: "test_service"},
      headers: {
        host: "localhost:5000",
      }
    });
    const res = mockResponse({ 
      writeHead: writeHeadMock
    });
    service(req, res);
    expect(writeHeadMock).toBeCalledWith(302, {
      Location: '/service'
    });
  });

  it("should return 302 redirect to /error when session is valid but there is neither a service cookie nor can one be set", () => {
    const writeHeadMock = jest.fn();
    const req = mockRequest({
      connection: {
        encrypted: false
      },
      body: {},
      headers: {
        host: "localhost:5000",
      }
    });
    const res = mockResponse({ 
      writeHead: writeHeadMock
    });
    service(req, res);
    expect(writeHeadMock).toBeCalledWith(302, {
      Location: '/error'
    });
  });

  it("should return 302 redirect to /error when session is not valid", () => {

    const req =

    const res =

    service(req, res);
    expect(writeHeadMock).toBeCalledWith(302, {
      Location: '/error'
    });
  });
});
