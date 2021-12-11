import { Result } from 'typescript-monads';

export enum IncubadoraUSP {
  CIETEC = 'CIETEC',
  ESALQTEC = 'ESALQTEC',
}

export enum EstadoIncubacao {
  INCUBADA = 'INCUBADA',
  GRADUADA = 'GRADUADA',
}

export class Incubacao {
  public readonly incubadora: string | IncubadoraUSP;

  constructor(incubadora: string | IncubadoraUSP, estado: EstadoIncubacao) {
    const validationResult = Incubacao.validateArgs(incubadora, estado);
    if (validationResult.isFail()) {
      throw new Error(validationResult.unwrapFail().toString());
    }

    this.incubadora = incubadora;
    this._estado = estado;
  }

  private _estado: EstadoIncubacao;

  public get estado(): EstadoIncubacao {
    return this._estado;
  }

  public set estado(e: EstadoIncubacao) {
    const validationResult = Incubacao.validateEstado(e);
    if (validationResult.isFail())
      throw new Error(validationResult.unwrapFail().toString());

    this._estado = e;
  }

  static create(
    incubadora: string | IncubadoraUSP,
    estado: EstadoIncubacao,
  ): Result<Incubacao, string[]> {
    const validationResult = Incubacao.validateArgs(incubadora, estado);
    if (validationResult.isFail())
      return Result.fail(validationResult.unwrapFail());

    return Result.ok(new Incubacao(incubadora, estado));
  }

  static validateArgs(
    incubadora: string | IncubadoraUSP,
    estado: EstadoIncubacao,
  ): Result<void, string[]> {
    const errors: string[] = [];
    const incubadoraResult = Incubacao.validateIncubadora(incubadora);
    if (incubadoraResult.isFail()) errors.push(incubadoraResult.unwrapFail());

    const estadoResult = Incubacao.validateEstado(estado);
    if (estadoResult.isFail()) {
      errors.push(estadoResult.unwrapFail());
    }

    if (errors.length > 0) {
      return Result.fail(errors);
    }

    return Result.ok(undefined);
  }

  static validateEstado(estado: EstadoIncubacao): Result<void, string> {
    return Object.values(EstadoIncubacao).includes(estado)
      ? Result.ok(undefined)
      : Result.fail('Estado inválido, deve ser INCUBADA ou GRADUADA');
  }

  static validateIncubadora(
    incubadora: string | IncubadoraUSP,
  ): Result<void, string> {
    return incubadora.length > 0
      ? Result.ok(undefined)
      : Result.fail('Incubadora inválida');
  }
}
