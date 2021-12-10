import { Result } from 'typescript-monads';

export class RegistroAnual {
  public readonly anoFiscal: number;

  constructor(anoFiscal: number, freeze = true) {
    const anoFiscalResult = RegistroAnual.validateAno(anoFiscal);

    if (anoFiscalResult.isFail())
      throw new Error(
        [
          ...[anoFiscalResult]
            .filter((r) => r.isFail())
            .map((r) => r.unwrapFail()),
        ].join('\n'),
      );

    this.anoFiscal = anoFiscal;

    if (freeze) Object.freeze(this);
  }

  public static create(anoFiscal: number): Result<RegistroAnual, string[]> {
    const anoFiscalResult = RegistroAnual.validateAno(anoFiscal);

    if (anoFiscalResult.isFail())
      return Result.fail(
        [anoFiscalResult].filter((r) => r.isFail()).map((r) => r.unwrapFail()),
      );

    return Result.ok(new RegistroAnual(anoFiscal));
  }

  static validateAno(ano: number): Result<any, string> {
    if (isNaN(ano)) return Result.fail('Valor inválido (não é número)');
    if (!Number.isSafeInteger(ano))
      return Result.fail('Valor inválido (não é inteiro)');
    if (ano < 0) return Result.fail('Valor inválido (ano negativo)');

    return Result.ok(undefined);
  }
}
