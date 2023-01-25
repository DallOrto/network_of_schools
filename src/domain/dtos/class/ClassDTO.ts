import { BaseModel } from "../../../commons/Commons";
import { WeekDays } from ".prisma/client";

export interface CreateClassRequest {
  name: string;
  classDay: WeekDays;
  startTime: string;
  endTime: string;
  schoolId: string;
}

export interface CreateClassResponse extends BaseModel {
  name: string;
  classDay: WeekDays;
  startTime: string;
  endTime: string;
  schoolId: string;
}
