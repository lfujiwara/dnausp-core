import { Result } from 'typescript-monads';
import {
  AgregadosAnuaisFactory,
  CNAE,
  CNPJ,
  Empresa,
  OrigemInvestimento,
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
  historicoQuadroDeColaboradores?: {
    anoFiscal: number;
    valor: number;
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

    const faturanteResult = this.extractHistoricoFaturamento(input);
    if (faturanteResult.isFail()) errors.push(faturanteResult.unwrapFail());

    const perfilInvestimentoResult = this.extractPerfilInvestimento(input);
    if (perfilInvestimentoResult.isFail())
      errors.push(...perfilInvestimentoResult.unwrapFail());

    const historicoQuadroDeColaboradoresResult =
      this.extractHistoricoQuadroDeColaboradores(input);
    if (historicoQuadroDeColaboradoresResult.isFail())
      errors.push(...historicoQuadroDeColaboradoresResult.unwrapFail());

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
      historicoQuadroDeColaboradores:
        historicoQuadroDeColaboradoresResult.unwrap(),
    });
    if (empresaResult.isFail()) errors.push(...empresaResult.unwrapFail());
    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(empresaResult.unwrap());
  }

  private static extractHistoricoFaturamento(input: EmpresaFactoryCreateInput) {
    const faturamentos =
      (input.faturamentos || [])
        .map((f) => RegistrosAnuaisFactory.faturamento(f.anoFiscal, f.valor))
        .filter((f) => f.isOk())
        .map((f) => f.unwrap()) || [];

    return AgregadosAnuaisFactory.faturante(faturamentos);
  }

  private static extractPerfilInvestimento(input: EmpresaFactoryCreateInput) {
    const investimentos =
      (input.investimentos || [])
        .map((f) =>
          RegistrosAnuaisFactory.investimento(
            f.anoFiscal,
            f.valor,
            f.origem as OrigemInvestimento,
          ),
        )
        .filter((f) => f.isOk())
        .map((f) => f.unwrap()) || [];
    return AgregadosAnuaisFactory.perfilInvestimento(investimentos);
  }

  private static extractHistoricoQuadroDeColaboradores(
    input: EmpresaFactoryCreateInput,
  ) {
    const quadrosDeColaboradores = (input.historicoQuadroDeColaboradores || [])
      .map((f) =>
        RegistrosAnuaisFactory.quadroDeColaboradores(f.anoFiscal, f.valor),
      )
      .filter((f) => f.isOk())
      .map((f) => f.unwrap());
    return AgregadosAnuaisFactory.historicoQuadroDeColaboradores(
      quadrosDeColaboradores,
    );
  }
}
