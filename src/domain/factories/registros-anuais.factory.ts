import { Result } from 'typescript-monads';
import {
  Investimento,
  OrigemInvestimento,
  RegistroAnual,
  ValorMonetarioAnual,
} from '@domain/valores-anuais/index';

export class RegistrosAnuaisFactory {
  static registroAnual(anoFiscal: number): Result<RegistroAnual, string[]> {
    const validationResult =
      RegistrosAnuaisFactory.validateRegistroAnual(anoFiscal);
    if (validationResult.isFail())
      return Result.fail(validationResult.unwrapFail());

    return Result.ok(new RegistroAnual(anoFiscal));
  }

  static validateRegistroAnual(anoFiscal: number): Result<void, string[]> {
    const anoFiscalResult = RegistroAnual.validateAno(anoFiscal);

    if (anoFiscalResult.isFail())
      return Result.fail([anoFiscalResult.unwrapFail()]);

    return Result.ok(undefined);
  }

  static validateValorMonetarioAnual(
    anoFiscal: number,
    valor: number,
  ): Result<void, string[]> {
    const errors: string[] = [];

    const registroAnualResult =
      RegistrosAnuaisFactory.validateRegistroAnual(anoFiscal);
    if (registroAnualResult.isFail())
      errors.push(...registroAnualResult.unwrapFail());

    const valorResult = ValorMonetarioAnual.validateValor(valor);
    if (valorResult.isFail()) errors.push(...valorResult.unwrapFail());

    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(undefined);
  }

  static valorMonetarioAnual(
    anoFiscal: number,
    valor: number,
  ): Result<ValorMonetarioAnual, string[]> {
    const validationResult = RegistrosAnuaisFactory.validateValorMonetarioAnual(
      anoFiscal,
      valor,
    );
    if (validationResult.isFail())
      return Result.fail(validationResult.unwrapFail());

    return Result.ok(new ValorMonetarioAnual(anoFiscal, valor));
  }

  static faturamento(anoFiscal: number, valor: number) {
    return RegistrosAnuaisFactory.valorMonetarioAnual(anoFiscal, valor);
  }

  static investimento(
    anoFiscal: number,
    valor: number,
    origem: OrigemInvestimento = OrigemInvestimento.OUTROS,
  ): Result<Investimento, string[]> {
    const validationResult = RegistrosAnuaisFactory.validateInvestimento(
      anoFiscal,
      valor,
      origem,
    );
    if (validationResult.isFail())
      return Result.fail(validationResult.unwrapFail());

    return Result.ok(new Investimento(anoFiscal, valor, origem));
  }

  static validateInvestimento(
    anoFiscal: number,
    valor: number,
    origem: OrigemInvestimento = OrigemInvestimento.OUTROS,
  ): Result<void, string[]> {
    const errors: string[] = [];

    const valorResult = Investimento.validateValor(valor);
    if (valorResult.isFail()) errors.push(valorResult.unwrapFail());

    const anoFiscalResult = Investimento.validateAno(anoFiscal);
    if (anoFiscalResult.isFail()) errors.push(anoFiscalResult.unwrapFail());

    const origemResult = Investimento.validateOrigem(origem);
    if (origemResult.isFail()) errors.push(origemResult.unwrapFail());

    if (errors.length > 0) return Result.fail(errors);
    return Result.ok(undefined);
  }
}
