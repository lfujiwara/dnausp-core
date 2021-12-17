export type DistribuicaoGeneroQueryOutput = {
  genero: string;
  qtd: number;
}[];

export abstract class DistribuicaoGeneroQuery {
  abstract execute(): Promise<DistribuicaoGeneroQueryOutput>;
}
