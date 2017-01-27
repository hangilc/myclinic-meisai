
export class Visit {
	public visitId: number;
	public patientId: number;
	public visitedAt: string;
	public shahokokuhoId: number;
	public koukikoureiId: number;
	public roujinId: number;
	public kouhi1Id: number;
	public kouhi2Id: number;
	public kouhi3Id: number;
}

export function fillVisitFromJson(visit: Visit, src: any): void {
	visit.visitId = src.visit_id;
	visit.patientId = src.patient_id;
	visit.visitedAt = src.v_datetime;
	visit.shahokokuhoId = src.shahokokuho_id;
	visit.koukikoureiId = src.koukikourei_id;
	visit.roujinId = src.roujin_id;
	visit.kouhi1Id = src.kouhi_1_id;
	visit.kouhi2Id = src.kouhi_2_id;
	visit.kouhi3Id = src.kouhi_3_id;
}

export function jsonToVisit(src: any): Visit {
	let visit = new Visit();
	fillVisitFromJson(visit, src);
	return visit;
}
