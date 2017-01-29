export class VisitMeisai {
	charge: number;
	futanWari: number;
	totalTen: number;
	sections: VisitMeisaiSection[];
}

export class VisitMeisaiSection {
	label: string;
	items: VisitMeisaiItem[];
	constructor(label: string, items: VisitMeisaiItem[]){
		this.label = label;
		this.items = items;
	}
}

export class VisitMeisaiItem {
	count: number;
	label: string;
	tanka: number;
}

function jsonToVisitMeisaiItem(src: any): VisitMeisaiItem {
	let item = new VisitMeisaiItem();
	item.count = src.count;
	item.label = src.label;
	item.tanka = src.tanka;
	return item;
}

export function jsonToVisitMeisai(src: any): VisitMeisai {
	let meisai = new VisitMeisai();
	meisai.charge = src.charge;
	meisai.futanWari = src.futanWari;
	meisai.totalTen = src.totalTen;
	let sections: VisitMeisaiSection[] = [];
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