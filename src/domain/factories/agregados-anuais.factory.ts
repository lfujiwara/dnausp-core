import { Result } from 'typescript-monads';
import { Faturamento } from '@domain/valores-anuais';
import { HistoricoFaturamentos } from '@domain/agregados-anuais';
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

  static historicoQuadroDeColaboradores(
    quadros: QuadroDeColaboradores[],
  ): Result<HistoricoQuadroDeColaboradores, string[]> {
    const result = HistoricoQuadroDeColaboradores.validateValores(quadros);
    if (result.isFail()) return Result.fail([result.unwrapFail()]);
    return Result.ok(new HistoricoQuadroDeColaboradores(quadros));
  }
}
