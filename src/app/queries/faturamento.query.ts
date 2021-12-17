import { FilterEmpresa } from '@app/queries/types/filter-empresa';

export type FaturamentoQueryOutput = {
  ano: number;
  valor: number;
}[];

export abstract class FaturamentoQuery {
  abstract execute(input: FilterEmpresa): Promise<FaturamentoQueryOutput>;
}
