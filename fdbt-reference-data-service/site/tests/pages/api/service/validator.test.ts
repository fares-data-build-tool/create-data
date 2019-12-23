import validator from "../../../pages/api/service/";
import { isSessionValid, isCookiesUUIDMatch } from "../../../../pages/api/service/validator";

describe("isSessionvalid", () => {
  it("should return a true when there is an operator cookie", () => {
    const props: NextPageContext = {}
    const expected = true;
    const result = isSessionValid(req);
    expect(result).toEqual(expected);
  });
  it("should return false when there is no operator cookie", () => {
    const expected = false;
    const result = isSessionValid(req);
    expect(result).toEqual(expected);
  });
});

describe("isCookiesUUIDMatch", () => {
  it("should return a true if uuids match", () => {
    const expected = true;
    const result = isCookiesUUIDMatch(req);
    expect(result).toEqual(expected);
  });
  it("should return false id uuids do  not match", () => {
    const expected = false;
    const result = isCookiesUUIDMatch(req);
    expect(result).toEqual(expected);
  });
});