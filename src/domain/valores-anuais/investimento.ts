import { Result } from 'typescript-monads';
import { ValorInteiroAnual } from '@domain/valores-anuais/valor-inteiro-anual';

export enum OrigemInvestimento {
  'PROPRIO' = 'PROPRIO',
  'ANJO' = 'ANJO',
  'CROWDFUNDING' = 'CROWDFUNDING',
  'VC' = 'VC',
  'PE' = 'PE',
  'PIPEFAPESP' = 'PIPEFAPESP',
  'BNDES_FINEP' = 'BNDES_FINEP',
  'OUTROS' = 'OUTROS',
}

export class Investimento extends ValorInteiroAnual {
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
