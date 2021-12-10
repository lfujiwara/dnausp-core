import { EmpresaDbPort } from '@app';
import { Result } from 'typescript-monads';
import { Empresa } from '@domain';

export interface RemoveFaturamentoMutationInput {
  empresaId: string;
  anoFiscal: number;
}

export class RemoveFaturamentoMutation {
  constructor(private readonly port: EmpresaDbPort) {}

  async execute(
    input: RemoveFaturamentoMutationInput,
  ): Promise<Result<Empresa, string[]>> {
    const empresaResult = await this.port.getEmpresa(input.empresaId);
    if (empresaResult.isFail()) return Result.fail(['Empresa não encontrada']);
    const empresa = empresaResult.unwrap();

    const result = empresa.faturante.remove(input.anoFiscal);
    if (result.isFail()) return Result.fail([result.unwrapFail()]);

    const portResult = await this.port.save(empresa);
    if (portResult.isFail()) return Result.fail([portResult.unwrapFail()]);

    return Result.ok(portResult.unwrap());
  }
}
