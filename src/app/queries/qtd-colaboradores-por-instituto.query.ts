import { FilterEmpresa } from '@app/queries/types/filter-empresa';

export type QtdColaboradoresPorInstitutoOutput = {
  [instituto: string]: number;
};

export abstract class QtdColaboradoresPorInstituto {
  abstract execute(
    input: FilterEmpresa,
  ): Promise<QtdColaboradoresPorInstitutoOutput>;
}
