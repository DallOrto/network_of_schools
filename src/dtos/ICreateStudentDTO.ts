

interface ICreateStudentDTO {
    name: string;
    document: string;
    password: string;
    birthDate: Date;
    schoolId: string
}

export { ICreateStudentDTO }