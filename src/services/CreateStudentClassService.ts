import { prismaDB } from "../database/prismaClient";
import { ICreateStudentClassDTO } from "../dtos/ICreateStudentClassDTO";
import { AppError } from "../error/AppError";


class CreateStudentClassService {
    async execute({ studentId, classId }: ICreateStudentClassDTO): Promise<void> {

        const studentExists = await prismaDB.student.findFirst({
            where: {
                id: studentId
            }
        });

        if(!studentExists) {
            throw new AppError("Student does not exists!");
        }

        const classExists = await prismaDB.class.findFirst({
            where: {
                id: classId
            }
        });

        if(!classExists) {
            throw new AppError("Class does not exists!");
        }

        const studentClass = await prismaDB.studentClass.create({
            data: {
                studentId,
                classId
            }
        });

    }
}

export { CreateStudentClassService }