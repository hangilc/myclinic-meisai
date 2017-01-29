import { request, arrayConverter, convertToString } from "./request";
//
import { Op } from "myclinic-drawer";
//
import { Visit, jsonToVisit, Patient, jsonToPatient, VisitMeisai, jsonToVisitMeisai } from "./model";

export function print(pages: Op[][], setting?: string): Promise<string> {
	return request<string>("/printer/print", { pages: pages, setting: setting }, "POST", convertToString);
}

export function listPrinterSettings(): Promise<string[]> {
	return request("/printer/setting", {}, "GET", arrayConverter(convertToString));
}

export function getVisit(visitId: number): Promise<Visit> {
	return request("/service/?_q=get_visit", { visit_id: visitId }, "GET", jsonToVisit);
}

export function getPatient(patientId: number): Promise<Patient> {
	return request("/service/?_q=get_patient", { patient_id: patientId }, "GET", jsonToPatient);
}

export function calcMeisai(visitId: number): Promise<VisitMeisai> {
	return request("/service/?_q=calc_meisai", { visit_id: visitId }, "GET", jsonToVisitMeisai );
}