import { Result } from 'typescript-monads';
import {
  AgregadosAnuaisFactory,
  CNAE,
  CNPJ,
  Empresa,
  OrigemInvestimento,
  RegistrosAnuaisFactory,
} from '@domain';
import { EstadoIncubacao, Incubacao } from '@domain/incubacao';

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
  historicoInvestimentos?: {
    anoFiscal: number;
    valor: number;
    origem: string;
  }[];
  historicoQuadroDeColaboradores?: {
    anoFiscal: number;
    valor: number;
  }[];
  incubacoes?: {
    incubadora: string;
    estado: string;
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

    const historicoFaturamentosResult = this.extractHistoricoFaturamento(input);
    if (historicoFaturamentosResult.isFail())
      errors.push(historicoFaturamentosResult.unwrapFail());

    const historicoInvestimentosResult =
      this.extractHistoricoInvestimentos(input);
    if (historicoInvestimentosResult.isFail())
      errors.push(...historicoInvestimentosResult.unwrapFail());

    const historicoQuadroDeColaboradoresResult =
      this.extractHistoricoQuadroDeColaboradores(input);
    if (historicoQuadroDeColaboradoresResult.isFail())
      errors.push(...historicoQuadroDeColaboradoresResult.unwrapFail());

    const incubacoesResult = this.extractIncubacoes(input);
    if (incubacoesResult.isFail())
      errors.push(...incubacoesResult.unwrapFail());

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
      historicoFaturamentos: historicoFaturamentosResult.unwrap(),
      historicoInvestimentos: historicoInvestimentosResult.unwrap(),
      historicoQuadroDeColaboradores:
        historicoQuadroDeColaboradoresResult.unwrap(),
      incubacoes: incubacoesResult.unwrap(),
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

    return AgregadosAnuaisFactory.historicoFaturamentos(faturamentos);
  }

  private static extractHistoricoInvestimentos(
    input: EmpresaFactoryCreateInput,
  ) {
    const investimentos =
      (input.historicoInvestimentos || [])
        .map((f) =>
          RegistrosAnuaisFactory.investimento(
            f.anoFiscal,
            f.valor,
            f.origem as OrigemInvestimento,
          ),
        )
        .filter((f) => f.isOk())
        .map((f) => f.unwrap()) || [];
    return AgregadosAnuaisFactory.historicoInvestimentos(investimentos);
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

  private static extractIncubacoes(
    input: EmpresaFactoryCreateInput,
  ): Result<Incubacao[], string[]> {
    const incubacoes = (input.incubacoes || [])
      .map((f) => Incubacao.create(f.incubadora, f.estado as EstadoIncubacao))
      .filter((f) => f.isOk())
      .map((f) => f.unwrap());
    return Result.ok(incubacoes);
  }
}
