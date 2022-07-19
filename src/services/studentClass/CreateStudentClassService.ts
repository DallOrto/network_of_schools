
import { CreateStudentClassRequest, CreateStudentClassResponse } from "../../domain/dtos/studentClass/StudentClassDTO";
import { ICreateStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICreateStudentClassRepository";
import { AppError } from "../../error/AppError";

class CreateStudentClassService {
    private studentClassRepository: ICreateStudentClassRepository;

    constructor(
        studentClassRepository: ICreateStudentClassRepository
    ) {
        this.studentClassRepository = studentClassRepository
    }

    async execute({ studentId, classId }: CreateStudentClassRequest): Promise<CreateStudentClassResponse> {

        // const studentExists = await prismaDB.student.findUnique({
        //     where: {
        //         id: studentId
        //     }
        // });

        // if(!studentExists) {
        //     throw new AppError("Student does not exists!");
        // }

        // const classExists = await prismaDB.class.findUnique({
        //     where: {
        //         id: classId
        //     }
        // });

        // if(!classExists) {
        //     throw new AppError("Class does not exists!");
        // }
        return this.studentClassRepository.create({ studentId, classId });
    }
}

export { CreateStudentClassService }