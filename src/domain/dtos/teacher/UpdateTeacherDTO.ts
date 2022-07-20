import { BaseModel } from "../../../commons/Commons";

export interface UpdateTeacherRequest {
    id: string;
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string
}

export interface UpdateTeacherResponse extends BaseModel {
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string
}