import { Empresa, Faturamento } from '@domain';
import { Result } from 'typescript-monads';

export abstract class EmpresaDbPort {
  abstract upsertEmpresa(empresa: Empresa): Promise<Result<Empresa, string>>;

  abstract getEmpresa(id: string): Promise<Result<Empresa, string>>;

  abstract addFaturamentoToEmpresa(
    empresaId: string,
    faturamento: Faturamento[],
  ): Promise<Result<Empresa, string>>;

  abstract removeFaturamentoFromEmpresa(
    empresaId: string,
    anosFiscais: number[],
  ): Promise<Result<Empresa, string>>;
}
