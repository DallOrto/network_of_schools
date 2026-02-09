interface ICountStudentClassRepository {
  countByClassId(classId: string): Promise<number>;
}

export { ICountStudentClassRepository };