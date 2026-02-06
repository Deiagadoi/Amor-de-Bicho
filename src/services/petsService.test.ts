import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { getPets } from "./petsService";
import { api } from "./api";

// Mock do módulo "./api"
vi.mock("./api", () => {
  return {
    api: {
      get: vi.fn(),
    },
  };
});

// atalho tipado para o mock
const mockedApiGet = api.get as unknown as Mock;

describe("petsService - getPets", () => {
  beforeEach(() => {
    mockedApiGet.mockReset();
  });

  it("deve chamar /v1/pets com paginação e busca e montar fotoUrl corretamente", async () => {
    const page = 2;
    const search = "Rex";

    const fakeResponse = {
      data: {
        content: [
          {
            id: 1,
            nome: "Rex",
            raca: "SRD",
            idade: 3,
            foto: {
              id: 10,
              nome: "rex.jpg",
              contentType: "image/jpeg",
              url: "https://exemplo.com/rex.jpg",
            },
          },
          {
            id: 2,
            nome: "Mimi",
            raca: "Poodle",
            idade: 5,
            foto: null,
          },
        ],
        totalPages: 5,
        totalElements: 2,
        number: page,
        size: 10,
      },
    };

    mockedApiGet.mockResolvedValue(fakeResponse as any);

    const result = await getPets(page, search);

    expect(mockedApiGet).toHaveBeenCalledWith("/v1/pets", {
      params: { page, size: 10, nome: search },
    });

    expect(result.totalPages).toBe(5);
    expect(result.content).toHaveLength(2);
    expect(result.content[0].fotoUrl).toBe("https://exemplo.com/rex.jpg");
    expect(result.content[1].fotoUrl).toBeNull();
  });

  it("deve funcionar sem termo de busca (search vazio)", async () => {
    const page = 0;

    const fakeResponse = {
      data: {
        content: [],
        totalPages: 1,
        totalElements: 0,
        number: page,
        size: 10,
      },
    };

    mockedApiGet.mockResolvedValue(fakeResponse as any);

    const result = await getPets(page, "");

    expect(mockedApiGet).toHaveBeenCalledWith("/v1/pets", {
      params: { page, size: 10 },
    });

    expect(result.content).toEqual([]);
    expect(result.totalPages).toBe(1);
  });
});
