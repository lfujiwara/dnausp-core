export type DistribuicaoInstitutoPorCnaeQueryOutput = {
  [cnae: string]: {
    [instituto: string]: number;
  };
}[];

export abstract class DistribuicaoInstitutoPorCnaeQuery {
  abstract execute(): Promise<DistribuicaoInstitutoPorCnaeQueryOutput>;
}
