"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const typed_dom_1 = require("./typed-dom");
const service_1 = require("./service");
class PrinterWidget {
    constructor(settingKey) {
        this.pages = [];
        this.settingKey = null;
        this.settingName = null;
        if (settingKey !== undefined) {
            this.settingKey = settingKey;
            this.settingName = getPrinterSetting(settingKey);
        }
        let printButton = typed_dom_1.h.button({}, ["印刷"]);
        printButton.addEventListener("click", event => {
            if (this.settingName === null) {
                service_1.print(this.pages);
            }
            else {
                service_1.print(this.pages, this.settingName);
            }
        });
        this.settingNameSpan = typed_dom_1.h.span({}, [this.settingName || "（プリンター未選択）"]);
        let selectPrinter = typed_dom_1.h.a({}, ["プリンター選択"]);
        selectPrinter.addEventListener("click", (event) => __awaiter(this, void 0, void 0, function* () {
            if (this.selectWorkarea.innerHTML === "") {
                let settings = yield service_1.listPrinterSettings();
                this.fillSelectWorkarea(settings);
            }
            else {
                this.selectWorkarea.innerHTML = "";
            }
        }));
        this.selectWorkarea = typed_dom_1.h.div({}, []);
        this.dom = typed_dom_1.h.div({}, [
            printButton,
            " ",
            "プリンター：",
            this.settingNameSpan,
            " ",
            selectPrinter,
            " ",
            typed_dom_1.h.a({ href: "/printer", target: "printer" }, ["プリンター管理"]),
            this.selectWorkarea
        ]);
    }
    setPages(pages) {
        this.pages = pages;
    }
    fillSelectWorkarea(settings) {
        let dom = this.selectWorkarea;
        let current = this.settingName;
        let form = typed_dom_1.h.form({}, []);
        {
            let opt = typed_dom_1.h.input({ type: "radio", name: "printer-setting" }, []);
            opt.checked = !current;
            opt.addEventListener("change", event => {
                this.updateSetting(null);
                dom.innerHTML = "";
            });
            typed_dom_1.appendToElement(form, [opt, "(プリンター未選択)", " "]);
        }
        settings.forEach(setting => {
            let opt = typed_dom_1.h.input({ type: "radio", name: "printer-setting" }, []);
            opt.checked = setting === current;
            opt.addEventListener("change", event => {
                this.updateSetting(setting);
                dom.innerHTML = "";
            });
            typed_dom_1.appendToElement(form, [opt, setting, " "]);
        });
        let cancel = typed_dom_1.h.button({}, ["キャンセル"]);
        cancel.addEventListener("click", event => {
            dom.innerHTML = "";
        });
        form.appendChild(cancel);
        dom.appendChild(form);
    }
    updateSetting(setting) {
        this.settingName = setting;
        if (this.settingKey !== undefined) {
            if (setting === null) {
                removePrinterSetting(this.settingKey);
            }
            else {
                setPrinterSetting(this.settingKey, setting);
            }
        }
        this.settingNameSpan.innerHTML = "";
        typed_dom_1.appendToElement(this.settingNameSpan, [setting || "（プリンター未選択）"]);
    }
}
exports.PrinterWidget = PrinterWidget;
function getPrinterSetting(key) {
    return window.localStorage.getItem(key);
}
exports.getPrinterSetting = getPrinterSetting;
function setPrinterSetting(key, name) {
    window.localStorage.setItem(key, name);
}
exports.setPrinterSetting = setPrinterSetting;
function removePrinterSetting(key) {
    window.localStorage.removeItem(key);
}
exports.removePrinterSetting = removePrinterSetting;
