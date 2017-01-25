"use strict";
const $ = require("jquery");
function arrayConverter(c) {
    return function (src) {
        return src.map(c);
    };
}
exports.arrayConverter = arrayConverter;
function convertToNumber(src) {
    return +src;
}
exports.convertToNumber = convertToNumber;
function convertToString(src) {
    return "" + src;
}
exports.convertToString = convertToString;
function request(url, data, method, cvtor) {
    return new Promise(function (resolve, reject) {
        let dataValue;
        if (method === "POST" && typeof data !== "string") {
            dataValue = JSON.stringify(data);
        }
        else {
            dataValue = data;
        }
        let opt = {
            url: url,
            type: method,
            data: dataValue,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            timeout: 15000,
            success: function (result) {
                try {
                    let obj = cvtor(result);
                    resolve(obj);
                }
                catch (ex) {
                    reject(ex);
                }
            },
            error: function (xhr, status, ex) {
                reject(JSON.stringify({ xhr: xhr, status: status, exception: ex }));
            }
        };
        $.ajax(opt);
    });
}
exports.request = request;
