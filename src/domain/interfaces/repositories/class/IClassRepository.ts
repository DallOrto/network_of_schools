import { CreateClassRequest, CreateClassResponse} from "../../../dtos/class/ClassDTO"

interface IClassRepository {
    create(data: CreateClassRequest): Promise<CreateClassResponse>
}

export { IClassRepository }