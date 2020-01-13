"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Handler = __importStar(require("../handler"));
var aws_lambda_mock_context_1 = __importDefault(require("aws-lambda-mock-context"));
describe('aws handler', function () {
    it('should call console.log', function () {
        var event = {
            Name: "myName"
        };
        var context = aws_lambda_mock_context_1.default();
        var callback = jest.fn();
        var globalAny = global;
        globalAny.console = {
            log: jest.fn()
        };
        Handler.s3hook(event, context, callback);
        expect(globalAny.console.log).toHaveBeenCalledWith(JSON.stringify(event));
    });
});
