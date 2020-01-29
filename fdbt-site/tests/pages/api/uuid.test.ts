import uuidHandler from "../../../pages/api/uuid";
import { mockRequest } from "mock-req-res";

describe("uuid handler", () => {
  it("should return a uuid", () => {
    const req = mockRequest();
    const val = {
        json: jest.fn()
    }
    const res : any  = {
        status: jest.fn().mockReturnValue(val)
    };
    uuidHandler(req , res);
    expect(res.status).toHaveBeenCalled();
    expect(val.json).toHaveBeenCalled();
  });
});
