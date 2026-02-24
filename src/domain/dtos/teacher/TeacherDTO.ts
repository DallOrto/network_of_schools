import { BaseModel } from "../../../commons/Commons";

export interface CreateTeacherRequest {
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string
}

export interface CreateTeacherResponse extends BaseModel {
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string;
    deletedAt?: Date | null;
}