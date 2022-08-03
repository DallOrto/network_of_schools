import { BaseModel } from "../../../commons/Commons";

export interface CreateNetworkRequest {
    name: string;
};

export interface UpdateNetworkRequest{
    id: string;
    name: string
}

export interface CreateNetworkResponse extends BaseModel {
    name: string;
};