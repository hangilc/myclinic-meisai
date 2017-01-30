import { Compiler, Op, Box } from "myclinic-drawer";
import { Visit, Patient, VisitMeisai, VisitMeisaiSection, VisitMeisaiItem } from "./model";
import * as kanjidate from "kanjidate";

class FontSpec {
	constructor(public name: string, public fontName: string, public size: number){};
}

class Point {
	x: number;
	y: number;
	constructor(x: number, y: number){
		this.x = x;
		this.y = y;
	}
}

class RenderEnv {
	titleFont: string;
	regularFont: string;
}

class Layout {
	titleCenterPoint: Point;
	upperBox: UpperBoxLayout;
	lowerBox: LowerBoxLayout;

	constructor(){
		let page = Box.createA4Box();
		let box = page.innerBox(30, 42, 30 + 140, 42 + 10 + 4 + 185);
		let [upperBox, _, lowerBox] = box.splitToRows(10, 14);
		this.titleCenterPoint = new Point(box.cx(), 30);
		this.upperBox = new UpperBoxLayout(upperBox);
		this.lowerBox = new LowerBoxLayout(lowerBox);
	}

	renderBlank(comp: Compiler, env: RenderEnv): void {
		comp.setFont(env.titleFont);
		comp.textAt("診療明細書", this.titleCenterPoint.x, this.titleCenterPoint.y, "center", "center");
		comp.setFont(env.regularFont);
		this.upperBox.renderBlank(comp, env);
		this.lowerBox.renderBlank(comp, env);
	}
}

class UpperBoxLayout {
	frame: Box;
	row1: UpperBoxRow1Layout;
	row2: UpperBoxRow2Layout;

	constructor(box: Box){
		this.frame = box;
		let [row1, row2] = box.splitToEvenRows(2);
		this.row1 = new UpperBoxRow1Layout(row1);
		this.row2 = new UpperBoxRow2Layout(row2);
	}

	renderBlank(comp: Compiler, env: RenderEnv): void {
		comp.box(this.frame);
		comp.frameBottom(this.row1.frame);
		this.row1.renderBlank(comp, env);
		this.row2.renderBlank(comp, env);
	}
}

class UpperBoxRow1Layout {
	frame: Box;
	cols: Box[];

	constructor(box: Box){
		this.frame = box;
		this.cols = box.splitToColumnsByWidths(17, 30, 10, 40, 16);
	}

	renderBlank(comp: Compiler, env: RenderEnv): void {
		let cols = this.cols;
		for(let i=0;i<cols.length-1;i++){
			comp.frameRight(cols[i]);
		}
		comp.textIn("患者番号", cols[0], "center", "center");
		comp.textIn("氏名", cols[2], "center", "center");
		comp.textIn("受診日", cols[4], "center", "center");
	}
}

class UpperBoxRow2Layout {
	frame: Box;
	cols: Box[];

	constructor(box: Box){
		this.frame = box;
		this.cols = box.splitToColumnsByWidths(17);
	}

	renderBlank(comp: Compiler, env: RenderEnv): void {
		comp.frameRight(this.cols[0]);
		comp.textIn("受診科", this.cols[0], "center", "center");
	}
}

class LowerBoxLayout {
	frame: Box;

	constructor(box: Box){
		this.frame = box;
	}

	renderBlank(comp: Compiler, env: RenderEnv): void {
		comp.box(this.frame);
	}
}

export class MeisaiForm {
	private comp: Compiler;
	private pages: Op[][] = [];

	constructor(visit: Visit | null, patient: Patient | null, meisai: VisitMeisai | null){
		this.comp = new Compiler();
		let env = new RenderEnv();
		let layout = new Layout();
		let comp = this.comp;
		comp.createFont("title-font", "MS Gothic", 6);
		comp.createFont("regular", "MS Gothic", 3);
		comp.createPen("regular", 0, 0, 0, 0.4);
		comp.setPen("regular");
		env.titleFont = "title-font";
		env.regularFont = "regular"
		layout.renderBlank(comp, env);
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
}

export class MeisaiFormOrig {
	private comp: Compiler;
	private pages: Op[][];
	private visit: Visit | null;
	private patient: Patient | null;
	private meisai: VisitMeisai | null;
	private outerFrame: Box;

	constructor(visit: Visit | null, patient: Patient | null, meisai: VisitMeisai | null){
		this.comp = new Compiler();
		this.pages = [];
		this.visit = visit;
		this.patient = patient;
		this.meisai = meisai;
		this.outerFrame = this.pageA4();
		this.prelude();
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

	prelude(): void {
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

	private pageA4(): Box {
		return Box.createA4Box();
	}

	private installFonts(specs: FontSpec[]): void{
		let comp = this.comp;
		specs.forEach(spec => {
			comp.createFont(spec.name, spec.fontName, spec.size);
		})
	}

	private renderUpperBox(box: Box): void {
		let comp = this.comp;
		let [row1, row2] = box.splitToEvenRows(2);
		this.renderUpperBoxRow1(row1);
		this.renderUpperBoxRow2(row2);
	}

	private renderUpperBoxRow1(box: Box): void {
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

	private renderUpperBoxRow2(box: Box): void {
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

	private renderLowerBox(box: Box): void {
		let comp = this.comp;
		comp.box(box);
		let rows = box.splitToRows(5);
		this.renderLowerBoxRow1(rows[0]);
		this.renderLowerBoxRow2(rows[1]);
	}

	private renderLowerBoxRow1(box: Box): void {
		let comp = this.comp;
		let cols = box.splitToColumnsByWidths(17, 80, 22.5);
		cols.forEach(col => comp.box(col));
		comp.setFont("regular");
		comp.textIn("部", cols[0], "center", "center");
		comp.textIn("項　目　名", cols[1], "center", "center");
		comp.textIn("点　数", cols[2], "center", "center");
		comp.textIn("回　数", cols[3], "center", "center");
	}

	private renderLowerBoxRow2(box: Box): void {
		let comp = this.comp;
		comp.setFont("regular");
		let cols = box.splitToColumnsByWidths(17, 80, 22.5);
		cols.forEach(col => comp.box(col));
		let [colBu, colItem, colTen, colTimes] = cols;
		let horizOffset = 1.3;
		let leading = 2;
		let itemLeading = 1;
		let top = colBu.top() + leading;
		let fontSize: number = comp.getCurrentFontSize();
		if( this.meisai !== null ){
			let sections = this.meisai.sections;

			// for multi-page dev
			sections = sections.concat(sections);
			sections = sections.concat(sections);
			sections = sections.concat(sections);
			sections = sections.concat(sections);
			sections = sections.concat(sections);
			sections = sections.concat(sections);
			sections = sections.concat(sections);
			sections = sections.concat(sections);
			// ///////////////////

			sections.forEach(sect => {
				if( sect.items.length === 0 ){
					return;
				}
				top = renderSection(sect, top);
				top += leading;
			})
		}
		comp.line(box.left(), top, box.right(), top);

		function renderSection(sect: VisitMeisaiSection, top: number): number {
			let lineTop = top;
			sect.items.forEach((item, index) => {
				if( index === 0 ){
					comp.textAt(sect.label, colBu.left() + horizOffset, top, "left", "top");
				}
				let lines = comp.breakLines(item.label, colItem.width() - horizOffset * 2, fontSize);
				if( lines.length === 0 ){
					lines = [""];
				}
				lines.forEach((line, lineIndex) => {
					comp.textAt(line, colItem.left() + horizOffset, lineTop, "left", "top");
					if( lineIndex === (lines.length - 1) ){
						comp.textAt("" + item.tanka, colTen.right() - horizOffset, lineTop, "right", "top");
						comp.textAt("" + item.count, colTimes.right() - horizOffset, lineTop, "right", "top");
					}
					lineTop += fontSize + itemLeading;
				})
			})
			return lineTop - itemLeading;
		}
	}

}