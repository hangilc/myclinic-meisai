"use strict";
const request_1 = require("./request");
//
const model_1 = require("./model");
function print(pages, setting) {
    return request_1.request("/printer/print", { pages: pages, setting: setting }, "POST", request_1.convertToString);
}
exports.print = print;
function listPrinterSettings() {
    return request_1.request("/printer/setting", {}, "GET", request_1.arrayConverter(request_1.convertToString));
}
exports.listPrinterSettings = listPrinterSettings;
function getVisit(visitId) {
    return request_1.request("/service/?_q=get_visit", { visit_id: visitId }, "GET", model_1.jsonToVisit);
}
exports.getVisit = getVisit;
