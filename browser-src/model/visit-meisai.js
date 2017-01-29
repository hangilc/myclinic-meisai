"use strict";
class VisitMeisai {
}
exports.VisitMeisai = VisitMeisai;
class VisitMeisaiSection {
    constructor(label, items) {
        this.label = label;
        this.items = items;
    }
}
exports.VisitMeisaiSection = VisitMeisaiSection;
class VisitMeisaiItem {
}
exports.VisitMeisaiItem = VisitMeisaiItem;
function jsonToVisitMeisaiItem(src) {
    let item = new VisitMeisaiItem();
    item.count = src.count;
    item.label = src.label;
    item.tanka = src.tanka;
    return item;
}
function jsonToVisitMeisai(src) {
    let meisai = new VisitMeisai();
    meisai.charge = src.charge;
    meisai.futanWari = src.futanWari;
    meisai.totalTen = src.totalTen;
    let sections = [];
    sections.push(new VisitMeisaiSection("初・再診料", src.meisai["初・再診料"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("医学管理等", src.meisai["医学管理等"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("在宅医療", src.meisai["在宅医療"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("検査", src.meisai["検査"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("画像診断", src.meisai["画像診断"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("投薬", src.meisai["投薬"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("注射", src.meisai["注射"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("処置", src.meisai["処置"].map(jsonToVisitMeisaiItem)));
    sections.push(new VisitMeisaiSection("その他", src.meisai["その他"].map(jsonToVisitMeisaiItem)));
    meisai.sections = sections;
    return meisai;
}
exports.jsonToVisitMeisai = jsonToVisitMeisai;
