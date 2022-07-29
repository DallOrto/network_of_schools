import { BaseModel } from "../../../commons/Commons";

export interface CreateClassRequest {
    name: string;
    classDay: string;
    time: Date;
    schoolId: string;
}

export interface CreateClassResponse extends BaseModel {
    name: string;
    classDay: string;
    time: Date;
    schoolId: string;
}