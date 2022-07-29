import { BaseModel } from "../../../commons/Commons";

export interface UpdateClassRequest {
    id: string;
    name: string;
    classDay: string;
    time: Date;
    schoolId: string;
}

export interface UpdateClassResponse extends BaseModel {
    name: string;
    classDay: string;
    time: Date;
    schoolId: string;
}