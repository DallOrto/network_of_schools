export interface ListClassTeacherWithStudentFilter {
  teacherId?: string;
  studentId?: string;
}

export interface ListClassTeacherWithStudentResponse {
  teacherId: string;
  classId: string;
}
