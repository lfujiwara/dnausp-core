import { Result } from 'typescript-monads';
import {
  AgregadosAnuaisFactory,
  CNAE,
  CNPJ,
  Empresa,
  Faturante,
  RegistrosAnuaisFactory,
} from '@domain';

export interface EmpresaFactoryCreateInput {
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
  investimentos?: {
    anoFiscal: number;
    valor: number;
    origem: string;
  }[];
}

export class EmpresaFactory {
  static create(input: EmpresaFactoryCreateInput): Result<Empresa, string[]> {
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

    const faturanteResult = AgregadosAnuaisFactory.faturante(faturamentos);

    const investimentos =
      (input.investimentos || [])
        .map((f) => RegistrosAnuaisFactory.investimento(f.anoFiscal, f.valor))
        .filter((f) => f.isOk())
        .map((f) => f.unwrap()) || [];
    const perfilInvestimentoResult =
      AgregadosAnuaisFactory.perfilInvestimento(investimentos);

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
      perfilInvestimento: perfilInvestimentoResult.unwrap(),
    });
    if (empresaResult.isFail()) errors.push(...empresaResult.unwrapFail());
    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(empresaResult.unwrap());
  }
}
