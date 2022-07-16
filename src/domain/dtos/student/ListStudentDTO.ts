export interface ListStudentFilter {
    schoolId?: string;
}

export interface ListStudentResponse {
    id: string;
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string;
    createdAt: Date;
    updatedAt: Date;
}