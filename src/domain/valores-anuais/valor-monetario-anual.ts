import { Result } from 'typescript-monads';
import { RegistroAnual } from '@domain/valores-anuais/registro-anual';

export class ValorMonetarioAnual extends RegistroAnual {
  public readonly valor: number;
  public readonly anoFiscal: number;

  constructor(anoFiscal: number, valor: number, freeze = true) {
    const valorResult = ValorMonetarioAnual.validateValor(valor);

    if (valorResult.isFail()) throw new Error(valorResult.unwrapFail());
    super(anoFiscal, false);
    this.valor = ValorMonetarioAnual.normalize(valor);

    if (freeze) Object.freeze(this);
  }

  static validateValor(valor: number): Result<any, string> {
    if (isNaN(valor)) return Result.fail('Valor inválido (não é número)');
    if (!Number.isSafeInteger(valor))
      return Result.fail('Valor inválido (não é inteiro)');

    return Result.ok(undefined);
  }

  static validateAno(ano: number): Result<any, string> {
    if (isNaN(ano)) return Result.fail('Valor inválido (não é número)');
    if (!Number.isSafeInteger(ano))
      return Result.fail('Valor inválido (não é inteiro)');
    if (ano < 0) return Result.fail('Valor inválido (ano negativo)');

    return Result.ok(undefined);
  }

  private static normalize(value: number): number {
    return Math.round(value);
  }
}
