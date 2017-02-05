"use strict";
const myclinic_drawer_1 = require("myclinic-drawer");
const kanjidate = require("kanjidate");
let breakLines = myclinic_drawer_1.Compiler.breakLines;
class MeisaiLine {
    constructor(bu, item, ten, times) {
        this.bu = bu;
        this.item = item;
        this.ten = ten;
        this.times = times;
    }
}
function makeMeisaiLines(sections, itemWidth, fontSize) {
    let meisaiLines = [];
    sections.forEach(section => {
        let sectionLabel = section.label;
        section.items.forEach((item, itemIndex) => {
            let lines = breakLines(item.label, itemWidth, fontSize);
            lines.forEach((line, lineIndex) => {
                let bu = null;
                let ten = null;
                let times = null;
                if (itemIndex === 0 && lineIndex === 0) {
                    bu = sectionLabel;
                }
                if (lineIndex === lines.length - 1) {
                    ten = "" + item.tanka;
                    times = "" + item.count;
                }
                meisaiLines.push(new MeisaiLine(bu, line, ten, times));
            });
        });
    });
    return meisaiLines;
}
class MeisaiForm {
    constructor(visit, patient, meisai) {
        this.pages = [];
        this.visit = null;
        this.patient = null;
        this.pageBox = myclinic_drawer_1.Box.createA4Box();
        this.itemColumnWidth = 80;
        this.itemFontSize = 3;
        this.meisaiLines = [];
        this.visit = visit;
        this.patient = patient;
        this.comp = new myclinic_drawer_1.Compiler();
        if (meisai !== null) {
            meisai.sections.forEach(section => {
                let items = section.items.slice();
                section.items = section.items.concat(items);
                section.items = section.items.concat(items);
                section.items = section.items.concat(items);
                section.items = section.items.concat(items);
                section.items = section.items.concat(items);
                section.items = section.items.concat(items);
            });
            this.meisaiLines = makeMeisaiLines(meisai.sections, this.itemColumnWidth, this.itemFontSize);
        }
        this.newPage();
        let maxPage = 10;
        while (--maxPage > 0 && this.meisaiLines.length > 0) {
            console.log(this.meisaiLines.length);
            this.newPage();
        }
    }
    done() {
        let ops = this.comp.getOps();
        if (ops.length > 0) {
            this.pages.push(ops);
        }
    }
    getPages() {
        return this.pages;
    }
    nextPage() {
        this.pages.push(this.comp.getOps());
        this.comp = new myclinic_drawer_1.Compiler();
        this.prolog();
    }
    newPage() {
        this.prolog();
        let box = this.pageBox.innerBox(30, 42, 30 + 140, 42 + 10 + 4 + 185 - 1);
        let [upperBox, _, lowerBox] = box.splitToRows(10, 14);
        this.comp.setFont("title-font");
        this.comp.textAt("診療明細書", box.cx(), 30, "center", "center");
        this.upperBox(upperBox);
        this.lowerBox(lowerBox);
    }
    prolog() {
        let comp = this.comp;
        comp.createFont("title-font", "MS Gothic", 6);
        comp.createFont("regular", "MS Gothic", this.itemFontSize);
        comp.createPen("regular", 0, 0, 0, 0.4);
        comp.setPen("regular");
    }
    upperBox(box) {
        let comp = this.comp;
        let [row1, row2] = box.splitToEvenRows(2);
        this.upperBoxRow1(row1);
        this.upperBoxRow2(row2);
    }
    upperBoxRow1(box) {
        let comp = this.comp;
        comp.box(box);
        let cols = box.splitToColumnsByWidths(17, 30, 10, 40, 16);
        cols.forEach(col => {
            comp.box(col);
        });
        comp.setFont("regular");
        {
            let c = cols[0];
            comp.textIn("患者番号", c, "center", "center");
        }
        if (this.patient !== null) {
            comp.textIn("" + this.patient.patientId, cols[1], "center", "center");
        }
        {
            let c = cols[2];
            comp.textIn("氏名", c, "center", "center");
        }
        if (this.patient !== null) {
            comp.textIn("" + this.patient.lastName + " " + this.patient.firstName, cols[3], "center", "center");
        }
        {
            let c = cols[4];
            comp.textIn("受診日", c, "center", "center");
        }
        if (this.visit !== null) {
            let at = kanjidate.format(kanjidate.f2, this.visit.visitedAt);
            comp.textIn(at, cols[5], "center", "center");
        }
    }
    upperBoxRow2(box) {
        let comp = this.comp;
        comp.box(box);
        let cols = box.splitToColumnsByWidths(17);
        cols.forEach(col => {
            comp.box(col);
        });
        comp.setFont("regular");
        {
            let c = cols[0];
            comp.textIn("受診科", c, "center", "center");
        }
    }
    lowerBox(box) {
        let comp = this.comp;
        comp.box(box);
        let rows = box.splitToRows(5);
        this.lowerBoxRow1(rows[0]);
        this.lowerBoxRow2(rows[1]);
    }
    lowerBoxRow1(box) {
        let comp = this.comp;
        let cols = box.splitToColumnsByWidths(17, 80, 22.5);
        cols.forEach(col => comp.box(col));
        comp.setFont("regular");
        comp.textIn("部", cols[0], "center", "center");
        comp.textIn("項　目　名", cols[1], "center", "center");
        comp.textIn("点　数", cols[2], "center", "center");
        comp.textIn("回　数", cols[3], "center", "center");
    }
    lowerBoxRow2(box) {
        let comp = this.comp;
        comp.setFont("regular");
        let cols = box.splitToColumnsByWidths(17, this.itemColumnWidth, 22.5);
        cols.forEach(col => comp.box(col));
        let [colBu, colItem, colTen, colTimes] = cols;
        let horizOffset = 1.3;
        let leading = 2;
        let itemLeading = 1;
        let topOffset = itemLeading;
        for (let i = 0; i < this.meisaiLines.length; i++) {
            let itemLine = this.meisaiLines[i];
            if (i === 0) {
            }
            else {
                if (itemLine.bu !== null) {
                    topOffset += leading;
                }
                else {
                    topOffset += itemLeading;
                }
            }
            if (i > 0 && box.top() + topOffset + comp.getCurrentFontSize() + itemLeading > box.bottom()) {
                this.meisaiLines = this.meisaiLines.slice(i);
                this.nextPage();
                return;
            }
            renderBu(itemLine.bu);
            renderItem(itemLine.item);
            renderTen(itemLine.ten);
            renderTimes(itemLine.times);
            topOffset += comp.getCurrentFontSize();
        }
        this.meisaiLines = [];
        {
            let lastY = box.top() + topOffset + itemLeading;
            comp.line(box.left(), lastY, box.right(), lastY);
        }
        function renderBu(bu) {
            if (bu === null) {
                return;
            }
            else {
                comp.textAt(bu, colBu.left() + horizOffset, box.top() + topOffset, "left", "top");
            }
        }
        function renderItem(item) {
            comp.textAt(item, colItem.left() + horizOffset, box.top() + topOffset, "left", "top");
        }
        function renderTen(item) {
            if (item === null) {
                return;
            }
            else {
                comp.textAt(item, colTen.right() - horizOffset, box.top() + topOffset, "right", "top");
            }
        }
        function renderTimes(item) {
            if (item === null) {
                return;
            }
            else {
                comp.textAt(item, colTimes.right() - horizOffset, box.top() + topOffset, "right", "top");
            }
        }
    }
}
exports.MeisaiForm = MeisaiForm;
