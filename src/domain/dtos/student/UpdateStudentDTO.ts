import { BaseModel } from "../../../commons/Commons";

export interface UpdateStudentRequest {
    id: string;
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string
}

export interface UpdateStudentResponse extends BaseModel {
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string
}