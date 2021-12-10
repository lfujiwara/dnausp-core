import { Result } from 'typescript-monads';
import { Faturamento, Investimento } from '@domain/valores-anuais';
import {
  HistoricoFaturamentos,
  HistoricoInvestimentos,
} from '@domain/agregados-anuais';
import { QuadroDeColaboradores } from '@domain/valores-anuais/quadro-de-colaboradores';
import { HistoricoQuadroDeColaboradores } from '@domain/agregados-anuais/historico-quadro-de-colaboradores';

export class AgregadosAnuaisFactory {
  static validateHistoricoFaturamentos(
    faturamentos: Faturamento[],
  ): Result<HistoricoFaturamentos, string> {
    const faturamentosResult =
      HistoricoFaturamentos.validateValores(faturamentos);
    if (faturamentosResult.isFail())
      return Result.fail(faturamentosResult.unwrapFail());
    return Result.ok(undefined);
  }

  static historicoFaturamentos(
    faturamentos: Faturamento[],
  ): Result<HistoricoFaturamentos, string> {
    const faturamentosResult = this.validateHistoricoFaturamentos(faturamentos);
    if (faturamentosResult.isFail())
      return Result.fail(faturamentosResult.unwrapFail());
    return Result.ok(new HistoricoFaturamentos(faturamentos));
  }

  static validateHistoricoInvestimentos(
    investimentos: Investimento[],
  ): Result<HistoricoInvestimentos, string[]> {
    const investimentosResult =
      HistoricoInvestimentos.validateValores(investimentos);
    if (investimentosResult.isFail())
      return Result.fail([investimentosResult.unwrapFail()]);
    return Result.ok(undefined);
  }

  static historicoInvestimentos(
    investimentos: Investimento[],
  ): Result<HistoricoInvestimentos, string[]> {
    const investimentosResult =
      AgregadosAnuaisFactory.validateHistoricoInvestimentos(investimentos);
    if (investimentosResult.isFail())
      return Result.fail(investimentosResult.unwrapFail());

    return Result.ok(new HistoricoInvestimentos(investimentos));
  }

  static historicoQuadroDeColaboradores(
    quadros: QuadroDeColaboradores[],
  ): Result<HistoricoQuadroDeColaboradores, string[]> {
    const result = HistoricoQuadroDeColaboradores.validateValores(quadros);
    if (result.isFail()) return Result.fail([result.unwrapFail()]);
    return Result.ok(new HistoricoQuadroDeColaboradores(quadros));
  }
}
