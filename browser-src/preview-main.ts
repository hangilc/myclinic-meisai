import { drawerToSvg, Op } from "myclinic-drawer";
import * as service from "./service";
import { PrinterWidget } from "./print-util";
import { MeisaiForm } from "./meisai-form";

let data = window["data"];

let form = new MeisaiForm();
form.done();
let pages: Op[][] = form.getPages();
let previewArea = document.getElementById("preview-wrapper");
let previewSvg = drawerToSvg(pages.length > 0 ? pages[0] : [], {
	width: "210mm",
	height: "297mm",
	viewBox: "0 0 210 297"
});
if( previewArea !== null ){
	previewArea.appendChild(previewSvg);
}
let printerSettingKey = "meisai-printer-setting";
let printerWidget = document.getElementById("printer-widget");
if( printerWidget !== null ){
	let widget = new PrinterWidget(printerSettingKey);
	widget.setPages(pages);
	printerWidget.appendChild(widget.dom);
}

import { getVisit } from "./service";

(async () => {
	let visit = await getVisit(1000);
	console.log(visit);
})();