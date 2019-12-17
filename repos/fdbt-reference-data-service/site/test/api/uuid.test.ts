import uuidHandler from "../../pages/api/uuid";

describe("uuid handler", () => {
  it("should return a uuid", () => {
    const req = null;
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
