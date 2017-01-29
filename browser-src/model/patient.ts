import * as moment from "moment";
import * as kanjidate from "kanjidate";

export class Patient {
	public patientId: number;
	public lastName: string;
	public firstName: string;
	public lastNameYomi: string;
	public firstNameYomi: string;
	public birthday: string;
	public sex: string;
	public address: string;
	public phone: string;
};

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

export function patientBirthdayRep(patient: Patient): string {
	let b = patient.birthday;
	if( b === "0000-00-00" ){
		return "";
	}
	let m = moment(b);
	if( !m.isValid() ){
		return `（生年月日が不適切：${ b }）`;
	}
	return kanjidate.format(kanjidate.f2, m.format("YYYY-MM-DD")) + "生";
}

export function patientAge(patient: Patient): number {
	let m = moment(patient.birthday);
	return moment().diff(m, "years");
}

export function patientSexRep(patient: Patient): string {
	switch(patient.sex){
		case "M": return "男";
		case "F": return "女";
		default: return "不明";
	}
}

export function jsonToPatient(src: any): Patient {
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

