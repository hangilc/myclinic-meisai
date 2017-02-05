import { Compiler, Op, Box } from "myclinic-drawer";
import { Visit, Patient, VisitMeisai, VisitMeisaiSection, VisitMeisaiItem } from "./model";
import * as kanjidate from "kanjidate";

let breakLines = Compiler.breakLines;

class MeisaiLine {
	bu: string | null;
	item: string;
	ten: string | null;
	times: string | null;

	constructor(bu: string | null, item: string, ten: string | null, times: string | null){
		this.bu = bu;
		this.item = item;
		this.ten = ten;
		this.times = times;
	}
}

function makeMeisaiLines(sections: VisitMeisaiSection[], itemWidth: number, fontSize: number): MeisaiLine[] {
	let meisaiLines: MeisaiLine[] = [];
	sections.forEach(section => {
		let sectionLabel = section.label;
		section.items.forEach((item, itemIndex) => {
			let lines = breakLines(item.label, itemWidth, fontSize);
			lines.forEach((line, lineIndex) => {
				let bu: string | null = null;
				let ten: string | null = null;
				let times: string | null = null;
				if( itemIndex === 0 && lineIndex === 0 ){
					bu = sectionLabel;
				}
				if( lineIndex === lines.length - 1 ){
					ten = "" + item.tanka;
					times = "" + item.count;
				}
				meisaiLines.push(new MeisaiLine(bu, line, ten, times));
			})
		})
	});
	return meisaiLines;
}

export class MeisaiForm {
	private comp: Compiler;
	private pages: Op[][] = [];
	private visit: Visit | null = null;
	private patient: Patient | null = null;
	private pageBox: Box = Box.createA4Box();
	private itemColumnWidth: number = 80;
	private itemFontSize: number = 3;
	private meisaiLines: MeisaiLine[] = [];

	constructor(visit: Visit | null, patient: Patient | null, meisai: VisitMeisai | null){
		this.visit = visit;
		this.patient = patient;
		this.comp = new Compiler();
		if( meisai !== null ){
			this.meisaiLines = makeMeisaiLines(meisai.sections, this.itemColumnWidth, this.itemFontSize);
		}
		this.newPage();
		let maxPage = 10;
		while( --maxPage > 0 && this.meisaiLines.length > 0 ){
			this.newPage();
		}
	}

	done(): void {
		let ops = this.comp.getOps();
		if( ops.length > 0 ){
			this.pages.push(ops);
		}
	}

	getPages(): Op[][] {
		return this.pages;
	}

	private nextPage(): void {
		this.pages.push(this.comp.getOps());
		this.comp = new Compiler();
		this.prolog();
	}

	private newPage(): void {
		this.prolog();
		let box = this.pageBox.innerBox(30, 42, 30 + 140, 42 + 10 + 4 + 185 - 1);
		let [upperBox, _, lowerBox] = box.splitToRows(10, 14);
		this.comp.setFont("title-font");
		this.comp.textAt("診療明細書", box.cx(), 30, "center", "center");
		this.upperBox(upperBox);
		this.lowerBox(lowerBox);
	}

	private prolog(): void {
		let comp = this.comp;
		comp.createFont("title-font", "MS Gothic", 6);
		comp.createFont("regular", "MS Gothic", this.itemFontSize);
		comp.createPen("regular", 0, 0, 0, 0.4);
		comp.setPen("regular");
	}

	private upperBox(box: Box): void {
		let comp = this.comp;
		let [row1, row2] = box.splitToEvenRows(2);
		this.upperBoxRow1(row1);
		this.upperBoxRow2(row2);
	}

	private upperBoxRow1(box: Box): void {
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
		if( this.patient !== null ){
			comp.textIn("" + this.patient.patientId, cols[1], "center", "center");
		}
		{
			let c = cols[2];
			comp.textIn("氏名", c, "center", "center");
		}
		if( this.patient !== null ){
			comp.textIn("" + this.patient.lastName + " " + this.patient.firstName, cols[3], "center", "center");
		}
		{
			let c = cols[4];
			comp.textIn("受診日", c, "center", "center");
		}
		if( this.visit !== null ){
			let at = kanjidate.format(kanjidate.f2, this.visit.visitedAt);
			comp.textIn(at, cols[5], "center", "center");
		}
	}

	private upperBoxRow2(box: Box): void {
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

	private lowerBox(box: Box): void {
		let comp = this.comp;
		comp.box(box);
		let rows = box.splitToRows(5);
		this.lowerBoxRow1(rows[0]);
		this.lowerBoxRow2(rows[1]);
	}

	private lowerBoxRow1(box: Box): void {
		let comp = this.comp;
		let cols = box.splitToColumnsByWidths(17, 80, 22.5);
		cols.forEach(col => comp.box(col));
		comp.setFont("regular");
		comp.textIn("部", cols[0], "center", "center");
		comp.textIn("項　目　名", cols[1], "center", "center");
		comp.textIn("点　数", cols[2], "center", "center");
		comp.textIn("回　数", cols[3], "center", "center");
	}

	private lowerBoxRow2(box: Box): void {
		let comp = this.comp;
		comp.setFont("regular");
		let cols = box.splitToColumnsByWidths(17, this.itemColumnWidth, 22.5);
		cols.forEach(col => comp.box(col));
		let [colBu, colItem, colTen, colTimes] = cols;
		let horizOffset = 1.3;
		let leading = 2;
		let itemLeading = 1;
		let topOffset = itemLeading;
		for(let i=0;i<this.meisaiLines.length;i++){
			let itemLine = this.meisaiLines[i];
			if( i === 0 ){
				// nop;
			} else {
				if( itemLine.bu !== null ){
					topOffset += leading;
				} else {
					topOffset += itemLeading;
				}
			}
			if( i > 0 && box.top() + topOffset + comp.getCurrentFontSize() + itemLeading > box.bottom() ){
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

		function renderBu(bu: string | null): void {
			if( bu === null ){
				return;
			} else {
				comp.textAt(bu, colBu.left() + horizOffset, box.top() + topOffset, "left", "top");
			}
		}

		function renderItem(item: string): void {
			comp.textAt(item, colItem.left() + horizOffset, box.top() + topOffset, "left", "top");
		}

		function renderTen(item: string | null): void {
			if( item === null ){
				return;
			} else {
				comp.textAt(item, colTen.right() - horizOffset, box.top() + topOffset, "right", "top");
			}
		}

		function renderTimes(item: string | null): void {
			if( item === null ){
				return;
			} else {
				comp.textAt(item, colTimes.right() - horizOffset, box.top() + topOffset, "right", "top");
			}
		}
	}

}
