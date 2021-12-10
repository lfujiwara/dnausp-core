import { Result } from 'typescript-monads';
import { Faturamento, Investimento } from '@domain/valores-anuais';
import { Faturante, PerfilInvestimento } from '@domain/agregados-anuais';

export class AgregadosAnuaisFactory {
  static validateFaturante(
    faturamentos: Faturamento[],
  ): Result<Faturante, string> {
    const faturamentosResult = Faturante.validateValores(faturamentos);
    if (faturamentosResult.isFail())
      return Result.fail(faturamentosResult.unwrapFail());
    return Result.ok(undefined);
  }

  static faturante(faturamentos: Faturamento[]): Result<Faturante, string> {
    const faturamentosResult = Faturante.validateValores(faturamentos);
    if (faturamentosResult.isFail())
      return Result.fail(faturamentosResult.unwrapFail());
    return Result.ok(new Faturante(faturamentos));
  }

  static validatePerfilInvestimento(
    investimentos: Investimento[],
  ): Result<PerfilInvestimento, string[]> {
    const investimentosResult =
      PerfilInvestimento.validateValores(investimentos);
    if (investimentosResult.isFail())
      return Result.fail([investimentosResult.unwrapFail()]);
    return Result.ok(undefined);
  }

  static perfilInvestimento(
    investimentos: Investimento[],
  ): Result<PerfilInvestimento, string[]> {
    const investimentosResult =
      PerfilInvestimento.validateValores(investimentos);
    if (investimentosResult.isFail())
      return Result.fail([investimentosResult.unwrapFail()]);
    return Result.ok(new PerfilInvestimento(investimentos));
  }
}
