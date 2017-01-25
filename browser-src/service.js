"use strict";
const request_1 = require("./request");
//
function print(pages, setting) {
    return request_1.request("/printer/print", { pages: pages, setting: setting }, "POST", request_1.convertToString);
}
exports.print = print;
function listPrinterSettings() {
    return request_1.request("/printer/setting", {}, "GET", request_1.arrayConverter(request_1.convertToString));
}
exports.listPrinterSettings = listPrinterSettings;
