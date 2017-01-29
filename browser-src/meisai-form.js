"use strict";
const myclinic_drawer_1 = require("myclinic-drawer");
const kanjidate = require("kanjidate");
class FontSpec {
    constructor(name, fontName, size) {
        this.name = name;
        this.fontName = fontName;
        this.size = size;
    }
    ;
}
class MeisaiForm {
    constructor(visit, patient, meisai) {
        this.comp = new myclinic_drawer_1.Compiler();
        this.pages = [];
        this.visit = visit;
        this.patient = patient;
        this.meisai = meisai;
        let outer = this.pageA4();
        let box = outer.innerBox(30, 42, 30 + 140, 42 + 10 + 4 + 185);
        let [upperBox, _, lowerBox] = box.splitToRows(10, 14);
        let comp = this.comp;
        this.installFonts([
            new FontSpec("title-font", "MS Gothic", 6),
            new FontSpec("regular", "MS Gothic", 3),
        ]);
        comp.createPen("regular", 0, 0, 0, 0.4);
        comp.setPen("regular");
        comp.setFont("title-font");
        comp.textAt("診療明細書", box.cx(), 30, "center", "center");
        this.renderUpperBox(upperBox);
        this.renderLowerBox(lowerBox);
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
    pageA4() {
        return myclinic_drawer_1.Box.createA4Box();
    }
    installFonts(specs) {
        let comp = this.comp;
        specs.forEach(spec => {
            comp.createFont(spec.name, spec.fontName, spec.size);
        });
    }
    renderUpperBox(box) {
        let comp = this.comp;
        let [row1, row2] = box.splitToEvenRows(2);
        this.renderUpperBoxRow1(row1);
        this.renderUpperBoxRow2(row2);
    }
    renderUpperBoxRow1(box) {
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
    renderUpperBoxRow2(box) {
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
    renderLowerBox(box) {
        let comp = this.comp;
        comp.box(box);
        let rows = box.splitToRows(5);
        this.renderLowerBoxRow1(rows[0]);
        this.renderLowerBoxRow2(rows[1]);
    }
    renderLowerBoxRow1(box) {
        let comp = this.comp;
        let cols = box.splitToColumnsByWidths(17, 80, 22.5);
        cols.forEach(col => comp.box(col));
        comp.setFont("regular");
        comp.textIn("部", cols[0], "center", "center");
        comp.textIn("項　目　名", cols[1], "center", "center");
        comp.textIn("点　数", cols[2], "center", "center");
        comp.textIn("回　数", cols[3], "center", "center");
    }
    renderLowerBoxRow2(box) {
        let comp = this.comp;
        comp.setFont("regular");
        let cols = box.splitToColumnsByWidths(17, 80, 22.5);
        cols.forEach(col => comp.box(col));
        let [colBu, colItem, colTen, colTimes] = cols;
        let horizOffset = 1.3;
        let leading = 2;
        let itemLeading = 1;
        let top = colBu.top() + leading;
        let fontSize = comp.getCurrentFontSize();
        if (this.meisai !== null) {
            this.meisai.sections.forEach(sect => {
                if (sect.items.length === 0) {
                    return;
                }
                top = renderSection(sect, top);
                top += leading;
            });
        }
        comp.line(box.left(), top, box.right(), top);
        function renderSection(sect, top) {
            let lineTop = top;
            sect.items.forEach((item, index) => {
                if (index === 0) {
                    comp.textAt(sect.label, colBu.left() + horizOffset, top, "left", "top");
                }
                let lines = comp.breakLines(item.label, colItem.width() - horizOffset * 2, fontSize);
                if (lines.length === 0) {
                    lines = [""];
                }
                lines.forEach((line, lineIndex) => {
                    comp.textAt(line, colItem.left() + horizOffset, lineTop, "left", "top");
                    if (lineIndex === (lines.length - 1)) {
                        comp.textAt("" + item.tanka, colTen.right() - horizOffset, lineTop, "right", "top");
                        comp.textAt("" + item.count, colTimes.right() - horizOffset, lineTop, "right", "top");
                    }
                    lineTop += fontSize + itemLeading;
                });
            });
            return lineTop - itemLeading;
        }
    }
}
exports.MeisaiForm = MeisaiForm;
