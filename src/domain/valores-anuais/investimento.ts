import { Result } from 'typescript-monads';
import { ValorMonetarioAnual } from '@domain/valores-anuais/valor-monetario-anual';

export enum OrigemInvestimento {
  'PROPRIO' = 'PROPRIO',
  'ANJO' = 'ANJO',
  'VC' = 'VC',
  'PE' = 'PE',
  'PIPEFAPESP' = 'PIPEFAPESP',
  'OUTROS' = 'OUTROS',
}

export class Investimento extends ValorMonetarioAnual {
  public readonly origem: OrigemInvestimento;

  constructor(anoFiscal: number, value: number, origem: OrigemInvestimento) {
    const resultOrigem = Investimento.validateOrigem(origem);
    if (resultOrigem.isFail()) throw new Error(resultOrigem.unwrapFail());

    super(anoFiscal, value, false);
    this.origem = origem;

    Object.freeze(this);
  }

  public static validateOrigem(
    origem: string,
  ): Result<OrigemInvestimento, string> {
    if (OrigemInvestimento[origem] === undefined) {
      return Result.fail<OrigemInvestimento, string>(
        `Origem de investimento inválida: ${origem}`,
      );
    }

    return Result.ok<OrigemInvestimento, string>(OrigemInvestimento[origem]);
  }
}
