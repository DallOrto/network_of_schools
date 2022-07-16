export interface ListSchoolFilter {
    networkId?: string
}

export interface ListSchoolResponse{
    id: string;
	name: string;
    address: string;
    networkId: string;
    createdAt: Date;
    updatedAt: Date
}