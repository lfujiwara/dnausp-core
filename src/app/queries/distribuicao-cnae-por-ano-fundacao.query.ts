export type DistribuicaoCnaePorAnoFundacaoQueryOutput = {
  ano: number;
  distribuicao: {
    [cnae: string]: number;
  };
};

export abstract class DistribuicaoCnaePorAnoFundacaoQuery {
  abstract execute(): Promise<DistribuicaoCnaePorAnoFundacaoQueryOutput>;
}
