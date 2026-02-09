import { WeekDays } from ".prisma/client";
import { BaseModel } from "../../../commons/Commons";

export interface UpdateClassRequest {
  id: string;
  name: string;
  classDay: WeekDays;
  startTime: string;
  endTime: string;
  schoolId: string;
  maxStudents: number;
}

export interface UpdateClassResponse extends BaseModel {
  name: string;
  classDay: WeekDays;
  startTime: string;
  endTime: string;
  schoolId: string;
  maxStudents: number;
}
