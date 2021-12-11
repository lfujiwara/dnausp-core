import { CNPJ, Empresa } from '@domain';
import { Result } from 'typescript-monads';

export abstract class EmpresaDbPort {
  abstract getEmpresa(id: string): Promise<Result<Empresa, string>>;

  abstract save(empresa: Empresa): Promise<Result<Empresa, string>>;

  abstract remove(id: string): Promise<Result<void, string>>;

  abstract findOneByIdentifiers(
    cnpj?: CNPJ,
    idEstrangeira?: number,
  ): Promise<Result<Empresa, string>>;
}
