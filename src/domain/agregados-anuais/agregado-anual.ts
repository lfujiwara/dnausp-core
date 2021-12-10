import { Result } from 'typescript-monads';
import { RegistroAnual } from '@domain/valores-anuais/registro-anual';

export abstract class AgregadoAnual<T extends RegistroAnual> {
  constructor(valores: T[] = []) {
    this._valores = valores;
  }

  private _valores: T[];

  get valores(): T[] {
    return this._valores;
  }

  set valores(valores: T[]) {
    const result = AgregadoAnual.validateValores(valores);
    if (result.isFail()) throw new Error(result.unwrapFail());

    this._valores = valores;
  }

  static validateValores(valores: RegistroAnual[]): Result<void, string> {
    const anoSet = new Set<number>(valores.map((f) => f.anoFiscal));
    if (anoSet.size !== valores.length)
      return Result.fail('Ano fiscal repetido');
    return Result.ok(undefined);
  }

  public add(valor: T): Result<void, string> {
    if (this.valores.find((f) => f.anoFiscal === valor.anoFiscal))
      return Result.fail('Ano fiscal repetido');

    this._valores.push(valor);
    return Result.ok(undefined);
  }

  public remove(anoFiscal: number) {
    const oldLength = this._valores.length;
    this._valores = this._valores.filter(
      (valor) => valor.anoFiscal !== anoFiscal,
    );

    if (oldLength === this._valores.length)
      return Result.fail(
        `Não foi encontrado um valor com o ano fiscal ${anoFiscal}`,
      );

    return Result.ok(undefined);
  }
}
