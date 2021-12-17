export type DistribuicaoGeneroPorInstitutoQueryOutput = {
  [instituto: string]: {
    genero: string;
    qtd: number;
  }[];
};

export abstract class DistribuicaoGeneroPorInstitutoQuery {
  abstract execute(): Promise<DistribuicaoGeneroPorInstitutoQueryOutput>;
}
