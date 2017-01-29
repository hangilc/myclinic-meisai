"use strict";
const moment = require("moment");
const kanjidate = require("kanjidate");
class Patient {
}
exports.Patient = Patient;
;
// export class PatientValues {
// 	public patientId: NumberValue;
// 	public lastName: StringValue;
// 	public firstName: StringValue;
// 	public lastNameYomi: StringValue;
// 	public firstNameYomi: StringValue;
// 	public birthday: StringValue;
// 	public sex: StringValue;
// 	public address: StringValue;
// 	public phone: StringValue
// }
// function hasError(values: PatientValues): boolean {
// 	return values.patientId.isError || values.lastName.isError || 
// 		values.firstName.isError || values.lastNameYomi.isError || 
// 		values.firstNameYomi.isError || values.birthday.isError || 
// 		values.sex.isError || values.address.isError || 
// 		values.phone.isError;
// }
// export function validatePatient(patient: Patient): null | PatientValues {
// 	let v = new PatientValues();
// 	v.patientId = ensureNumber(patient.patientId)
// 		.isInteger()
// 		.isPositive()
// 	v.lastName = ensureString(patient.lastName)
// 		.isNotEmpty()
// 	v.firstName = ensureString(patient.firstName)
// 		.isNotEmpty()
// 	v.lastNameYomi = ensureString(patient.lastNameYomi)
// 		.isNotEmpty()
// 	v.firstNameYomi = ensureString(patient.firstNameYomi)
// 		.isNotEmpty()
// 	v.birthday = ensureString(patient.birthday)
// 		.isSqlDate()
// 		.isZeroOrValidDate()
// 	v.sex = ensureString(patient.sex)
// 		.oneOf("M", "F")
// 	v.address = ensureString(patient.address)
// 	v.phone = ensureString(patient.phone)
// 	if( hasError(v) ){
// 		return v;
// 	} else {
// 		return null;
// 	}
// }
function patientBirthdayRep(patient) {
    let b = patient.birthday;
    if (b === "0000-00-00") {
        return "";
    }
    let m = moment(b);
    if (!m.isValid()) {
        return `（生年月日が不適切：${b}）`;
    }
    return kanjidate.format(kanjidate.f2, m.format("YYYY-MM-DD")) + "生";
}
exports.patientBirthdayRep = patientBirthdayRep;
function patientAge(patient) {
    let m = moment(patient.birthday);
    return moment().diff(m, "years");
}
exports.patientAge = patientAge;
function patientSexRep(patient) {
    switch (patient.sex) {
        case "M": return "男";
        case "F": return "女";
        default: return "不明";
    }
}
exports.patientSexRep = patientSexRep;
function jsonToPatient(src) {
    let p = new Patient();
    p.patientId = src.patient_id;
    p.lastName = src.last_name;
    p.firstName = src.first_name;
    p.lastNameYomi = src.last_name_yomi;
    p.firstNameYomi = src.first_name_yomi;
    p.birthday = src.birth_day;
    p.sex = src.sex;
    p.address = src.address;
    p.phone = src.phone;
    return p;
}
exports.jsonToPatient = jsonToPatient;
