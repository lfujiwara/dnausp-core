import { Result } from 'typescript-monads';
import {
  CNAE,
  CNPJ,
  Empresa,
  Faturante,
  RegistrosAnuaisFactory,
} from '@domain';
import { EmpresaDbPort } from '@app';

export interface UpsertEmpresaMutationInput {
  idEstrangeira?: number;
  estrangeira?: boolean;
  cnpj?: string;
  razaoSocial?: string;
  nomeFantasia?: string;
  anoFundacao: number;
  atividadePrincipal?: string;
  atividadeSecundaria?: string[];
  situacao?: string;
  faturamentos?: {
    anoFiscal: number;
    valor: number;
  }[];
}

export class UpsertEmpresaMutation {
  constructor(private readonly port: EmpresaDbPort) {}

  async mutate(
    input: UpsertEmpresaMutationInput,
  ): Promise<Result<Empresa, string[]>> {
    const errors: string[] = [];

    const cnpjResult = CNPJ.create(input.cnpj + '');
    if (cnpjResult.isFail()) errors.push(cnpjResult.unwrapFail());

    const atividadePrincipalResult = CNAE.create(input.atividadePrincipal + '');
    if (atividadePrincipalResult.isFail())
      errors.push(atividadePrincipalResult.unwrapFail());

    const atividadeSecundariaResults = (input.atividadeSecundaria || []).map(
      (as) => CNAE.create(as),
    );
    errors.push(
      ...atividadeSecundariaResults
        .filter((asr) => asr.isFail())
        .map((asr) => asr.unwrapFail()),
    );

    const anoDeFundacaoResult = Empresa.validateAnoDeFundacao(
      input.anoFundacao,
    );
    if (anoDeFundacaoResult.isFail())
      errors.push(anoDeFundacaoResult.unwrapFail());

    const faturamentos =
      (input.faturamentos || [])
        .map((f) => RegistrosAnuaisFactory.faturamento(f.anoFiscal, f.valor))
        .filter((f) => f.isOk())
        .map((f) => f.unwrap()) || [];

    const faturamentosResult = Faturante.validateValores(faturamentos);
    if (faturamentosResult.isFail())
      errors.push(faturamentosResult.unwrapFail());

    const faturanteResult = Faturante.create(faturamentos);

    if (errors.length > 0) return Result.fail(errors);

    const empresaResult = Empresa.create({
      cnpj: cnpjResult.unwrap(),
      razaoSocial: input.razaoSocial,
      nomeFantasia: input.nomeFantasia,
      anoFundacao: anoDeFundacaoResult.unwrap(),
      atividadePrincipal: atividadePrincipalResult.unwrap(),
      atividadeSecundaria: atividadeSecundariaResults.map((asr) =>
        asr.unwrap(),
      ),
      situacao: input.situacao,
      estrangeira: !!input.estrangeira,
      idEstrangeira: input.idEstrangeira,
      faturante: faturanteResult.unwrap(),
    });
    if (empresaResult.isFail()) errors.push(...empresaResult.unwrapFail());
    if (errors.length > 0) return Result.fail(errors);

    const instance = empresaResult.unwrap();
    const result = await this.port.upsertEmpresa(instance);

    if (result.isFail()) return Result.fail([result.unwrapFail()]);

    return Result.ok(result.unwrap());
  }
}
