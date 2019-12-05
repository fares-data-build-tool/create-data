"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var s3hook = function (event, context) {
    console.log("==== This is my event object ====");
    console.log(JSON.stringify(event));
    console.log("==== This is my context object ====");
    console.log(JSON.stringify(context));
    console.log("==== This is my process.env object ====");
    console.log(JSON.stringify(process.env));
};
exports.s3hook = s3hook;
