"use strict";
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
