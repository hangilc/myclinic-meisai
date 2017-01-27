import { Compiler, Op, Box } from "myclinic-drawer";

class FontSpec {
	constructor(public name: string, public fontName: string, public size: number){};
}

export class MeisaiForm {
	private comp: Compiler;
	private pages: Op[][];

	constructor(){
		this.comp = new Compiler();
		this.pages = [];
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
		let cols = box.splitToColumnsByWidths(16, 31, 10, 39, 17);
		cols.forEach(col => {
			comp.box(col);
		});
		comp.setFont("regular");
		{
			let c = cols[0];
			comp.textIn("患者番号", c, "center", "center");
		}
		{
			let c = cols[2];
			comp.textIn("氏名", c, "center", "center");
		}
		{
			let c = cols[4];
			comp.textIn("受診日", c, "center", "center");
		}
	}

	private renderUpperBoxRow2(box: Box): void {
		let comp = this.comp;
		comp.box(box);
		let cols = box.splitToColumnsByWidths(16);
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
		let cols = box.splitToColumnsByWidths(16, 81, 22.5);
		cols.forEach(col => comp.box(col));
	}

	private renderLowerBoxRow2(box: Box): void {
		let comp = this.comp;
		let cols = box.splitToColumnsByWidths(16, 81, 22.5);
		cols.forEach(col => comp.box(col));

	}

}