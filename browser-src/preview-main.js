"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const myclinic_drawer_1 = require("myclinic-drawer");
const print_util_1 = require("./print-util");
const meisai_form_1 = require("./meisai-form");
let data = window["data"];
let form = new meisai_form_1.MeisaiForm();
form.done();
let pages = form.getPages();
let previewArea = document.getElementById("preview-wrapper");
let previewSvg = myclinic_drawer_1.drawerToSvg(pages.length > 0 ? pages[0] : [], {
    width: "210mm",
    height: "297mm",
    viewBox: "0 0 210 297"
});
if (previewArea !== null) {
    previewArea.appendChild(previewSvg);
}
let printerSettingKey = "meisai-printer-setting";
let printerWidget = document.getElementById("printer-widget");
if (printerWidget !== null) {
    let widget = new print_util_1.PrinterWidget(printerSettingKey);
    widget.setPages(pages);
    printerWidget.appendChild(widget.dom);
}
const service_1 = require("./service");
(() => __awaiter(this, void 0, void 0, function* () {
    let visit = yield service_1.getVisit(1000);
    console.log(visit);
}))();
