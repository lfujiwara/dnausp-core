import { Result } from 'typescript-monads';
import { RegistroAnual } from '@domain/valores-anuais/registro-anual';

export class ValorInteiroPositivoAnual extends RegistroAnual {
  public readonly valor: number;
  public readonly anoFiscal: number;

  constructor(anoFiscal: number, valor: number, freeze = true) {
    const valorResult = ValorInteiroPositivoAnual.validateValor(valor);

    if (valorResult.isFail()) throw new Error(valorResult.unwrapFail());
    super(anoFiscal, false);

    this.valor = valor;

    if (freeze) Object.freeze(this);
  }

  static validateValor(valor: number): Result<any, string> {
    if (isNaN(valor)) return Result.fail('Valor inválido (não é número)');
    if (valor < 0) return Result.fail('Valor inválido (menor que zero)');
    if (!Number.isSafeInteger(valor))
      return Result.fail('Valor inválido (não é inteiro)');

    return Result.ok(undefined);
  }
}
