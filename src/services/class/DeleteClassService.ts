import { ICreateClassRepository } from "../../domain/interfaces/repositories/class/ICreateClassRepository";
import { AppError } from "../../error/AppError";

class DeleteClassService {
  private classRepository: ICreateClassRepository;

  constructor(classRepository: ICreateClassRepository) {
    this.classRepository = classRepository;
  }

  async execute(id: string): Promise<void> {
    const classExists = await this.classRepository.findOne(id);

    if (!classExists) {
      throw new AppError("Class does not exist!", 404);
    }

    await this.classRepository.softDelete(id);
  }
}

export { DeleteClassService };