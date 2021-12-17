import { FilterEmpresa } from '@app/queries/types/filter-empresa';

export type QtdEmpresasPorAnoDeFundacaoQueryOutput = {
  ano: number;
  qtd: number;
}[];

export abstract class QtdEmpresasPorAnoDeFundacaoQuery {
  abstract execute(
    input: FilterEmpresa,
  ): Promise<QtdEmpresasPorAnoDeFundacaoQueryOutput>;
}
