export class VisitMeisai {
	charge: number;
	futanWari: number;
	totalTen: number;
	sections: {
		"初・再診料": VisitMeisaiItem[];
		"医学管理等": VisitMeisaiItem[];
		"在宅医療": VisitMeisaiItem[];
		"検査": VisitMeisaiItem[];
		"画像診断": VisitMeisaiItem[];
		"投薬": VisitMeisaiItem[];
		"注射": VisitMeisaiItem[];
		"処置": VisitMeisaiItem[];
		"その他": VisitMeisaiItem[];
	};

	static sectionNames: string[] = [
        "初・再診料", "医学管理等", "在宅医療", "検査", "画像診断",
        "投薬", "注射", "処置", "その他"       
    ];
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
	meisai.sections = {
		"初・再診料": src.meisai["初・再診料"].map(jsonToVisitMeisaiItem),
		"医学管理等": src.meisai["医学管理等"].map(jsonToVisitMeisaiItem),
		"在宅医療": src.meisai["在宅医療"].map(jsonToVisitMeisaiItem),
		"検査": src.meisai["検査"].map(jsonToVisitMeisaiItem),
		"画像診断": src.meisai["画像診断"].map(jsonToVisitMeisaiItem),
		"投薬": src.meisai["投薬"].map(jsonToVisitMeisaiItem),
		"注射": src.meisai["注射"].map(jsonToVisitMeisaiItem),
		"処置": src.meisai["処置"].map(jsonToVisitMeisaiItem),
		"その他": src.meisai["その他"].map(jsonToVisitMeisaiItem),
	};
	return meisai;
}