import { Result } from 'typescript-monads';
import {
  CNPJ,
  Empresa,
  EmpresaFactory,
  EmpresaFactoryCreateInput,
} from '@domain';
import { EmpresaDbPort } from '@app';

export type UpsertEmpresaMutationInput = EmpresaFactoryCreateInput;

export class UpsertEmpresaMutation {
  constructor(private readonly port: EmpresaDbPort) {}

  async mutate(
    input: UpsertEmpresaMutationInput,
  ): Promise<Result<Empresa, string[]>> {
    let existingResult;

    if (!!input.cnpj) {
      const cnpjResult = CNPJ.create(input.cnpj);
      existingResult = await this.port.findOneByIdentifiers(
        cnpjResult.isOk() ? cnpjResult.unwrap() : undefined,
        input.idEstrangeira,
      );
    } else existingResult = Result.fail('Empresa não encontrada');

    const empresaResult = EmpresaFactory.create(input);
    if (empresaResult.isFail())
      return Result.fail<Empresa, string[]>(empresaResult.unwrapFail());
    const instance = empresaResult.unwrap();

    if (existingResult.isOk()) {
      instance.id = existingResult.unwrap().id;
      await this.port.remove(existingResult.unwrap().id);
    }

    const result = await this.port.save(instance);
    if (result.isFail()) return Result.fail([result.unwrapFail()]);

    return Result.ok(result.unwrap());
  }
}
