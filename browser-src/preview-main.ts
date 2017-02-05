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
	renderPreview(pages.length > 0 ? pages[0] : []);
	let printerSettingKey = "meisai-printer-setting";
	let printerWidget = document.getElementById("printer-widget");
	if( printerWidget !== null ){
		let widget = new PrinterWidget(printerSettingKey);
		widget.onPageChange = pageIndex => {
			renderPreview(pages[pageIndex]);
			widget.updateNavPage(pageIndex+1);
		};
		widget.setPages(pages);
		printerWidget.appendChild(widget.dom);
	}

	function renderPreview(page: Op[]): void {
		if( previewArea !== null ){
			previewArea.innerHTML = "";
			let previewSvg = drawerToSvg(page, {
				width: "210mm",
				height: "297mm",
				viewBox: "0 0 210 297"
			});
			previewArea.appendChild(previewSvg);
		}
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
		let visit = await service.getVisit(visitId);
		let patient = await service.getPatient(visit.patientId);
		let meisai = await service.calcMeisai(visit.visitId);
		return new FetchData(visit, patient, meisai);
	} else {
		return null;
	}
}
