import { WeekDays } from ".prisma/client";
import {
  CreateClassRequest,
  CreateClassResponse
} from "../../../dtos/class/ClassDTO";

interface ICreateClassRepository {
  create(data: CreateClassRequest): Promise<CreateClassResponse>;
  findOne(id: string): Promise<CreateClassResponse | null>;
  findOneClass(
    name: string,
    classDay: WeekDays,
    startTime: string,
    endTime: string
  ): Promise<CreateClassResponse | null>;
  softDelete(id: string): Promise<void>;
}

export { ICreateClassRepository };
