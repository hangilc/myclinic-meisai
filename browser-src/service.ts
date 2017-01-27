import { request, arrayConverter, convertToString } from "./request";
//
import { Op } from "myclinic-drawer";
//
import { Visit, jsonToVisit } from "./model";

export function print(pages: Op[][], setting?: string): Promise<string> {
	return request<string>("/printer/print", { pages: pages, setting: setting }, "POST", convertToString);
}

export function listPrinterSettings(): Promise<string[]> {
	return request("/printer/setting", {}, "GET", arrayConverter(convertToString));
}

export function getVisit(visitId: number): Promise<Visit> {
	return request("/service/?_q=get_visit", { visit_id: visitId }, "GET", jsonToVisit);
}