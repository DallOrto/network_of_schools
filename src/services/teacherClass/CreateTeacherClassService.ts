import { CreateTeacherClassRequest, CreateTeacherClassResponse } from "../../domain/dtos/teacherClass/TeacherClassDTO";
import { ITeacherClassRepository } from "../../domain/interfaces/repositories/teacherClass/ITeacherClassRepository";
import { AppError } from "../../error/AppError";

class CreateTeacherClassService {
    private teacherClassRepository: ITeacherClassRepository;

    constructor(
        teacherClassRepository: ITeacherClassRepository
    ) {
        this.teacherClassRepository = teacherClassRepository
    }

    async execute({ teacherId, classId }: CreateTeacherClassRequest): Promise<CreateTeacherClassResponse> {
        // const teacherExists = await prismaDB.teacher.findUnique({
        //     where: {
        //         id: teacherId
        //     }
        // });

        // if(!teacherExists) {
        //     throw new AppError("Teacher does not exists!");
        // }

        // const classExists = await prismaDB.class.findUnique({
        //     where: {
        //         id: classId
        //     }
        // });

        // if(!classExists) {
        //     throw new AppError("Class does not exists!");
        // }

        return this.teacherClassRepository.create({ teacherId, classId });
    }
}

export { CreateTeacherClassService }