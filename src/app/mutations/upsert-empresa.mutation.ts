import { Result } from 'typescript-monads';
import { Empresa, EmpresaFactory, EmpresaFactoryCreateInput } from '@domain';
import { EmpresaDbPort } from '@app';

export type UpsertEmpresaMutationInput = EmpresaFactoryCreateInput;

export class UpsertEmpresaMutation {
  constructor(private readonly port: EmpresaDbPort) {}

  async mutate(
    input: UpsertEmpresaMutationInput,
  ): Promise<Result<Empresa, string[]>> {
    const empresaResult = EmpresaFactory.create(input);
    if (empresaResult.isFail())
      return Result.fail<Empresa, string[]>(empresaResult.unwrapFail());
    const instance = empresaResult.unwrap();

    const result = await this.port.upsertEmpresa(instance);
    if (result.isFail()) return Result.fail([result.unwrapFail()]);

    return Result.ok(result.unwrap());
  }
}
