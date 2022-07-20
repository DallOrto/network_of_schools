import { BaseModel } from "../../../commons/Commons";

export interface UpdateSchoolRequest {
    id: string
    name: string;
    address: string;
    networkId: string;
};

export interface UpdateSchoolResponse extends BaseModel {
    name: string;
    address: string;
    networkId: string;
};
