import { drawerToSvg, Op } from "myclinic-drawer";
import * as service from "./service";
import { PrinterWidget } from "./print-util";
import { MeisaiForm } from "./meisai-form";
import { Visit, Patient, VisitMeisai } from "./model";

let data = window["data"] || {};
let visitId: number = +(data.visit_id || data.visitId);

(async function(){
	let meisaiData = await fetchData(visitId);
	let form: MeisaiForm;
	if( meisaiData === null ){
		form = new MeisaiForm(null, null, null);
	} else {
		form = new MeisaiForm(meisaiData.visit, meisaiData.patient, meisaiData.meisai);
	}
	form.done();
	let pages: Op[][] = form.getPages();
	let previewArea = document.getElementById("preview-wrapper");
	let previewSvg = drawerToSvg(pages.length > 0 ? pages[pages.length-1] : [], {
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
})();

class FetchData {
	visit: Visit;
	patient: Patient;
	meisai: VisitMeisai;
	constructor(visit: Visit, patient: Patient, meisai: VisitMeisai){
		this.visit = visit;
		this.patient = patient;
		this.meisai = meisai;
	}
}

async function fetchData(visitId: number): Promise<FetchData|null> {
	if( visitId > 0 ){
		let visit = await service.getVisit(1000);
		let patient = await service.getPatient(visit.patientId);
		let meisai = await service.calcMeisai(visit.visitId);
		return new FetchData(visit, patient, meisai);
	} else {
		return null;
	}
}
