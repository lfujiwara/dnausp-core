import { Result } from 'typescript-monads';
import {
  Investimento,
  OrigemInvestimento,
  RegistroAnual,
  ValorInteiroAnual,
} from '@domain/valores-anuais';
import { QuadroDeColaboradores } from '@domain/valores-anuais/quadro-de-colaboradores';

export class RegistrosAnuaisFactory {
  static validateRegistroAnual(anoFiscal: number): Result<void, string[]> {
    const anoFiscalResult = RegistroAnual.validateAno(anoFiscal);

    if (anoFiscalResult.isFail())
      return Result.fail([anoFiscalResult.unwrapFail()]);

    return Result.ok(undefined);
  }

  static validateValorInteiroAnual(
    anoFiscal: number,
    valor: number,
  ): Result<void, string[]> {
    const errors: string[] = [];

    const registroAnualResult =
      RegistrosAnuaisFactory.validateRegistroAnual(anoFiscal);
    if (registroAnualResult.isFail())
      errors.push(...registroAnualResult.unwrapFail());

    const valorResult = ValorInteiroAnual.validateValor(valor);
    if (valorResult.isFail()) errors.push(...valorResult.unwrapFail());

    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(undefined);
  }

  static valorInteiroAnual(
    anoFiscal: number,
    valor: number,
  ): Result<ValorInteiroAnual, string[]> {
    const validationResult = RegistrosAnuaisFactory.validateValorInteiroAnual(
      anoFiscal,
      valor,
    );
    if (validationResult.isFail())
      return Result.fail(validationResult.unwrapFail());

    return Result.ok(new ValorInteiroAnual(anoFiscal, valor));
  }

  static faturamento(anoFiscal: number, valor: number) {
    return RegistrosAnuaisFactory.valorInteiroAnual(anoFiscal, valor);
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

  static quadroDeColaboradores(
    anoFiscal: number,
    valor: number,
  ): Result<QuadroDeColaboradores, string[]> {
    const validationResult =
      RegistrosAnuaisFactory.validateQuadroDeColaboradores(anoFiscal, valor);
    if (validationResult.isFail())
      return Result.fail(validationResult.unwrapFail());

    return Result.ok(new QuadroDeColaboradores(anoFiscal, valor));
  }

  static validateQuadroDeColaboradores(
    anoFiscal: number,
    valor: number,
  ): Result<void, string[]> {
    const errors: string[] = [];

    const valorResult = QuadroDeColaboradores.validateValor(valor);
    if (valorResult.isFail()) errors.push(valorResult.unwrapFail());

    const anoFiscalResult = QuadroDeColaboradores.validateAno(anoFiscal);
    if (anoFiscalResult.isFail()) errors.push(anoFiscalResult.unwrapFail());

    if (errors.length > 0) return Result.fail(errors);
    return Result.ok(undefined);
  }
}
