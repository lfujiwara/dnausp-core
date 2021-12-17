export type DistribuicaoCnaePorInstitutoQueryOutput = {
  [instituto: string]: {
    [cnae: string]: number;
  };
};

export abstract class DistribuicaoCnaePorInstitutoQuery {
  abstract execute(): Promise<DistribuicaoCnaePorInstitutoQueryOutput>;
}
