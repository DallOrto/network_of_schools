import { Prisma, PrismaClient } from "@prisma/client";
import { prismaDB } from "../../database/prismaClient";
import { CreateStudentClassRequest, CreateStudentClassResponse } from "../../domain/dtos/studentClass/StudentClassDTO";
import { ICreateStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICreateStudentClassRepository";
import { ICountStudentClassRepository } from "../../domain/interfaces/repositories/studentClass/ICountStudentClassRepository";
import { IFindStudentClassesWithClassRepository, StudentClassWithClass } from "../../domain/interfaces/repositories/studentClass/IFindStudentClassesWithClassRepository";
import { AppError } from "../../error/AppError";
import { hasScheduleConflict } from "../../utils/scheduleConflict";

class StudentClassRepository implements ICreateStudentClassRepository, ICountStudentClassRepository, IFindStudentClassesWithClassRepository {
    private prismaRepository: PrismaClient

    constructor() {
        this.prismaRepository = prismaDB;
    }

    async createAtomic({ studentId, classId }: CreateStudentClassRequest): Promise<CreateStudentClassResponse> {
        return this.prismaRepository.$transaction(async (tx) => {
            const classRecord = await tx.class.findUnique({ where: { id: classId } });

            if (!classRecord) {
                throw new AppError("Class does not exist!");
            }

            const currentCount = await tx.studentClass.count({ where: { classId } });

            if (currentCount >= classRecord.maxStudents) {
                throw new AppError(
                    `Class has reached maximum capacity of ${classRecord.maxStudents} students!`
                );
            }

            const studentClasses = await tx.studentClass.findMany({
                where: { studentId },
                include: { class: true },
            });

            for (const sc of studentClasses) {
                if (hasScheduleConflict(sc.class, classRecord)) {
                    throw new AppError(
                        `Schedule conflict! Student is already enrolled in "${sc.class.name}" ` +
                        `on ${sc.class.classDay} from ${sc.class.startTime} to ${sc.class.endTime}.`
                    );
                }
            }

            return tx.studentClass.create({ data: { studentId, classId } });
        }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
    }

    async create({ studentId, classId }: CreateStudentClassRequest): Promise<CreateStudentClassResponse> {
        return this.prismaRepository.studentClass.create({
            data: {
                studentId,
                classId
            }
        });
    }

    async countByClassId(classId: string): Promise<number> {
        return this.prismaRepository.studentClass.count({
            where: {
                classId
            }
        });
    }

    async findByStudentIdWithClass(studentId: string): Promise<StudentClassWithClass[]> {
        return this.prismaRepository.studentClass.findMany({
            where: {
                studentId
            },
            include: {
                class: true
            }
        });
    }
}

export { StudentClassRepository };
