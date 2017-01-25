"use strict";
const myclinic_drawer_1 = require("myclinic-drawer");
const print_util_1 = require("./print-util");
let data = window["data"];
let comp = new myclinic_drawer_1.Compiler();
comp.moveTo(data.x, data.y);
comp.lineTo(100, 200);
let ops = comp.getOps();
let previewArea = document.getElementById("preview-wrapper");
let previewSvg = myclinic_drawer_1.drawerToSvg(ops, {
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
    widget.setPages([ops]);
    printerWidget.appendChild(widget.dom);
}
