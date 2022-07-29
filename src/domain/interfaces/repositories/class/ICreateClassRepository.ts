import { CreateClassRequest, CreateClassResponse} from "../../../dtos/class/ClassDTO"

interface ICreateClassRepository {
    create(data: CreateClassRequest): Promise<CreateClassResponse>
}

export { ICreateClassRepository }