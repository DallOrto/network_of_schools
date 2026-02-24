import { BaseModel } from "../../../commons/Commons";

export interface CreateStudentRequest {
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string
}

export interface CreateStudentResponse extends BaseModel {
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string;
    deletedAt: Date | null;
}