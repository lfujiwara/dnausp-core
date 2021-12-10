import { Result } from 'typescript-monads';
import { AgregadoAnual } from '@domain/agregados-anuais/agregado-anual';
import { Faturamento } from '@domain/valores-anuais';

export class Faturante extends AgregadoAnual<Faturamento> {
  static create(faturamentos = []): Result<Faturante, string> {
    const faturamentosResult = Faturante.validateValores(faturamentos);
    if (faturamentosResult.isFail())
      return Result.fail(faturamentosResult.unwrapFail());

    return Result.ok(new Faturante(faturamentos));
  }
}
