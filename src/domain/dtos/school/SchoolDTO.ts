import { BaseModel } from "../../../commons/Commons";

export interface CreateSchoolRequest {
    name: string;
    address: string;
    networkId: string;
};

export interface CreateSchoolResponse extends BaseModel {
    name: string;
    address: string;
    networkId: string;
};
