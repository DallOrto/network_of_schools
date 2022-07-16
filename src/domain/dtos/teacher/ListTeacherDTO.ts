export interface ListTeacherFilter {
    schoolId?: string;
}

export interface ListTeacherResponse {
    id: string;
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string;
    createdAt: Date;
    updatedAt: Date;
}