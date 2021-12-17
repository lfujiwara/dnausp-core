export type DistribuicaoGeneroPorAnoFundacaoQueryOutput = {
  anoFundacao: number;
  distribuicao: {
    genero: string;
    qtd: number;
  }[];
};

export abstract class DistribuicaoGeneroPorAnoFundacaoQuery {
  abstract execute(): Promise<DistribuicaoGeneroPorAnoFundacaoQueryOutput>;
}
