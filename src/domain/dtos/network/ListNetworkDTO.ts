export interface ListNetworkFilter {
    networkId?: string;
}

export interface ListNetworkStudentResponse {
    id: string;
    name: string;
    document: string;
    birthDate: Date;
    schoolId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ListNetworkTeacherResponse {
    id: string;
    name: string;
    document: string;
    birthDate: Date;
    schoolId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ListNetworkSchoolResponse {
    id: string;
    name: string;
    address: string;
    networkId: string;
    createdAt: Date;
    updatedAt: Date;
    Teacher: ListNetworkTeacherResponse[];
    Student: ListNetworkStudentResponse[];
}

export interface ListNetworkResponse {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    School: ListNetworkSchoolResponse[];
}
