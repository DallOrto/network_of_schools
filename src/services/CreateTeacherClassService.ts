import { prismaDB } from "../database/prismaClient";
import { ICreateTeacherClassDTO } from "../dtos/ICreateTeacherClassDTO";
import { AppError } from "../error/AppError";


class CreateTeacherClassService {
    async execute({ teacherId, classId }: ICreateTeacherClassDTO): Promise<void> {

        const teacherExists = await prismaDB.teacher.findFirst({
            where: {
                id: teacherId
            }
        });

        if(!teacherExists) {
            throw new AppError("Teacher does not exists!");
        }

        const classExists = await prismaDB.class.findFirst({
            where: {
                id: classId
            }
        });

        if(!classExists) {
            throw new AppError("Class does not exists!");
        }

        const teacherClass = await prismaDB.teacherClass.create({
            data: {
                teacherId,
                classId
            }
        });

    }
}

export { CreateTeacherClassService }