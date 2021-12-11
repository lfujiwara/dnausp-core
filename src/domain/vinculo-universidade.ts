import { Result } from 'typescript-monads';
import { Instituto } from '@domain/enums/instituto';
import { TipoVinculo } from '@domain/enums/tipo-vinculo';

export class VinculoUniversidade {
  readonly tipo: TipoVinculo;
  readonly NUSP?: string;
  readonly instituto?: string;

  constructor(tipo: TipoVinculo, NUSP?: string, instituto?: string) {
    const validationResult = VinculoUniversidade.validateArgs(
      tipo,
      NUSP,
      instituto,
    );
    if (validationResult.isFail())
      throw new Error(validationResult.unwrapFail().toString());

    this.tipo = tipo;
    this.NUSP = NUSP;
    this.instituto = instituto;
  }

  static create(
    tipo: TipoVinculo,
    NUSP?: string,
    instituto?: string,
  ): Result<VinculoUniversidade, string[]> {
    const validationResult = this.validateArgs(tipo, NUSP, instituto);
    if (validationResult.isFail())
      return Result.fail(validationResult.unwrapFail());

    return Result.ok(new VinculoUniversidade(tipo, NUSP, instituto));
  }

  static validateTipo(tipo: TipoVinculo): Result<void, string> {
    if (!TipoVinculo[tipo])
      return Result.fail(`Tipo de vínculo inválido: ${tipo}`);
    return Result.ok(undefined);
  }

  static validateInstituto(instituto: Instituto): Result<void, string> {
    if (!Instituto[instituto])
      return Result.fail(`Instituto inválido: ${instituto}`);
    return Result.ok(undefined);
  }

  static validateNUSP(NUSP?: string): Result<void, string> {
    if (NUSP === undefined) return Result.ok(undefined);
    if (NUSP === '') return Result.fail('NUSP não pode ser vazio');
    if (!/^\d+$/.test(NUSP)) return Result.fail('NUSP deve ser um número');

    return Result.ok(undefined);
  }

  static validateArgs(
    tipo: TipoVinculo,
    NUSP?: string,
    instituto?: string,
  ): Result<void, string[]> {
    const errors: string[] = [];

    const tipoResult = this.validateTipo(tipo);
    if (tipoResult.isFail()) errors.push(tipoResult.unwrapFail());

    const institutoResult = this.validateInstituto(instituto as Instituto);
    if (institutoResult.isFail()) errors.push(institutoResult.unwrapFail());

    const NUSPResult = this.validateNUSP(NUSP);
    if (NUSPResult.isFail()) errors.push(NUSPResult.unwrapFail());

    return errors.length > 0 ? Result.fail(errors) : Result.ok(undefined);
  }
}
