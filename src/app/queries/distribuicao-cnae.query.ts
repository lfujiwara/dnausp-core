import { FilterEmpresa } from '@app/queries/types/filter-empresa';

export type DistribuicaoCnaeQueryOutput = {
  [cnae: string]: number;
};

export abstract class DistribuicaoCnaeQuery {
  abstract execute(
    filter?: FilterEmpresa,
  ): Promise<DistribuicaoCnaeQueryOutput>;
}
