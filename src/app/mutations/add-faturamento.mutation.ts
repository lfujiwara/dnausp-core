import { EmpresaDbPort } from '@app';
import { Empresa, RegistrosAnuaisFactory } from '@domain';
import { Result } from 'typescript-monads';

export interface AddFaturamentoMutationInput {
  empresaId: string;
  anoFiscal: number;
  valor: number;
}

export class AddFaturamentoMutation {
  constructor(private readonly port: EmpresaDbPort) {}

  async execute(
    input: AddFaturamentoMutationInput,
  ): Promise<Result<Empresa, string[]>> {
    const faturamentoResult = RegistrosAnuaisFactory.faturamento(
      input.anoFiscal,
      input.valor,
    );
    if (faturamentoResult.isFail())
      return Result.fail(faturamentoResult.unwrapFail());

    const empresaResult = await this.port.getEmpresa(input.empresaId);
    if (empresaResult.isFail()) return Result.fail(['Empresa não encontrada']);

    const empresa = empresaResult.unwrap();
    const addFaturamentoResult = empresa.historicoFaturamentos.add(
      faturamentoResult.unwrap(),
    );

    if (addFaturamentoResult.isFail())
      return Result.fail([addFaturamentoResult.unwrapFail()]);

    const result = await this.port.save(empresa);
    if (result.isFail()) return Result.fail([result.unwrapFail()]);

    return Result.ok(result.unwrap());
  }
}
