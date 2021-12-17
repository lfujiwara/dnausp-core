export type DistribuicaoCnaePorAnoFundacaoQueryOutput = {
  [instituto: string]: {
    [cnae: string]: number;
  };
};

export abstract class DistribuicaoCnaePorAnoFundacaoQuery {
  abstract execute(): Promise<DistribuicaoCnaePorAnoFundacaoQueryOutput>;
}
