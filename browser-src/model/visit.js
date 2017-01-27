"use strict";
class Visit {
}
exports.Visit = Visit;
function fillVisitFromJson(visit, src) {
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
exports.fillVisitFromJson = fillVisitFromJson;
function jsonToVisit(src) {
    let visit = new Visit();
    fillVisitFromJson(visit, src);
    return visit;
}
exports.jsonToVisit = jsonToVisit;
