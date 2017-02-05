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
const service = require("./service");
const print_util_1 = require("./print-util");
const meisai_form_1 = require("./meisai-form");
let data = window["data"] || {};
let visitId = +(data.visit_id || data.visitId);
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        let meisaiData = yield fetchData(visitId);
        let form;
        if (meisaiData === null) {
            form = new meisai_form_1.MeisaiForm(null, null, null);
        }
        else {
            form = new meisai_form_1.MeisaiForm(meisaiData.visit, meisaiData.patient, meisaiData.meisai);
        }
        form.done();
        let pages = form.getPages();
        let previewArea = document.getElementById("preview-wrapper");
        let previewSvg = myclinic_drawer_1.drawerToSvg(pages.length > 0 ? pages[pages.length - 1] : [], {
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
    });
})();
class FetchData {
    constructor(visit, patient, meisai) {
        this.visit = visit;
        this.patient = patient;
        this.meisai = meisai;
    }
}
function fetchData(visitId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (visitId > 0) {
            let visit = yield service.getVisit(1000);
            let patient = yield service.getPatient(visit.patientId);
            let meisai = yield service.calcMeisai(visit.visitId);
            return new FetchData(visit, patient, meisai);
        }
        else {
            return null;
        }
    });
}
