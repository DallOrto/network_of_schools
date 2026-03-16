import { ListNetworkService } from "../../services/network/ListNetworkService";
import { IListNetworkRepository } from "../../domain/interfaces/repositories/network/IListNetworkRepository";
import { ListNetworkResponse } from "../../domain/dtos/network/ListNetworkDTO";

const mockNetwork: ListNetworkResponse = {
  id: "network-id",
  name: "Rede Estadual SP",
  createdAt: new Date(),
  updatedAt: new Date(),
  School: [
    {
      id: "school-id",
      name: "Escola Central",
      address: "Rua das Flores, 100",
      networkId: "network-id",
      createdAt: new Date(),
      updatedAt: new Date(),
      Teacher: [
        {
          id: "teacher-id",
          name: "Prof. Maria",
          document: "11111111111",
          birthDate: new Date("1985-03-10"),
          schoolId: "school-id",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      Student: [
        {
          id: "student-id",
          name: "João Silva",
          document: "22222222222",
          birthDate: new Date("2000-01-01"),
          schoolId: "school-id",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ],
};

const makeRepository = (
  result: ListNetworkResponse[] = [mockNetwork]
): jest.Mocked<IListNetworkRepository> => ({
  listNetwork: jest.fn().mockResolvedValue(result),
});

describe("ListNetworkService", () => {
  it("deve retornar todas as redes com escolas, professores e alunos", async () => {
    const service = new ListNetworkService(makeRepository());

    const result = await service.execute({});

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ id: "network-id", name: "Rede Estadual SP" });
    expect(result[0].School).toHaveLength(1);
    expect(result[0].School[0].Teacher).toHaveLength(1);
    expect(result[0].School[0].Student).toHaveLength(1);
  });

  it("deve filtrar pelo networkId quando informado", async () => {
    const repo = makeRepository();
    const service = new ListNetworkService(repo);

    await service.execute({ networkId: "network-id" });

    expect(repo.listNetwork).toHaveBeenCalledWith({ networkId: "network-id" });
  });

  it("deve retornar lista vazia quando não há redes cadastradas", async () => {
    const service = new ListNetworkService(makeRepository([]));

    const result = await service.execute({});

    expect(result).toEqual([]);
  });

  it("deve retornar rede sem escolas quando não há escolas vinculadas", async () => {
    const networkSemEscolas: ListNetworkResponse = { ...mockNetwork, School: [] };
    const service = new ListNetworkService(makeRepository([networkSemEscolas]));

    const result = await service.execute({});

    expect(result[0].School).toHaveLength(0);
  });
});
