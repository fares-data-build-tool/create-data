"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3hook = function (event) {
    console.log("==== This is my event object ====");
    console.log(JSON.stringify(event));
};
