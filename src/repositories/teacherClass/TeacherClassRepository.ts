import { Prisma, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateTeacherClassRequest, CreateTeacherClassResponse } from "../../domain/dtos/teacherClass/TeacherClassDTO";
import { ICreateTeacherClassRepository } from "../../domain/interfaces/repositories/teacherClass/ICreateTeacherClassRepository";
import { AppError } from "../../error/AppError";
import { hasScheduleConflict } from "../../utils/scheduleConflict";

class TeacherClassRepository implements ICreateTeacherClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async createAtomic({ teacherId, classId }: CreateTeacherClassRequest): Promise<CreateTeacherClassResponse> {
        return this.prismaRepository.$transaction(async (tx) => {
            const classRecord = await tx.class.findUnique({ where: { id: classId } });

            if (!classRecord) {
                throw new AppError("Class does not exist!");
            }

            const teacherClasses = await tx.teacherClass.findMany({
                where: { teacherId },
                include: { class: true },
            });

            for (const tc of teacherClasses) {
                if (tc.classId === classId) {
                    throw new AppError("Teacher is already assigned to this class!");
                }
                if (hasScheduleConflict(tc.class, classRecord)) {
                    throw new AppError(
                        `Schedule conflict! Teacher is already assigned to "${tc.class.name}" ` +
                        `on ${tc.class.classDay} from ${tc.class.startTime} to ${tc.class.endTime}.`
                    );
                }
            }

            return tx.teacherClass.create({ data: { teacherId, classId } });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    }

    async create({ teacherId, classId }: CreateTeacherClassRequest): Promise<CreateTeacherClassResponse> {
        return this.prismaRepository.teacherClass.create({
            data: {
                teacherId,
                classId
            }
        });
    }
}

export { TeacherClassRepository };