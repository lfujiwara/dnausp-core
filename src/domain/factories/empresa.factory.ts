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
import { VinculoUniversidade } from '@domain/vinculo-universidade';
import { Socio } from '@domain/socio';
import { TipoVinculo } from '@domain/enums/tipo-vinculo';

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
  socios?: {
    nome: string;
    email?: string;
    telefone?: string;
    vinculo: {
      tipo: TipoVinculo;
      NUSP?: string;
      instituto?: string;
    };
  }[];
}

export class EmpresaFactory {
  static create(input: EmpresaFactoryCreateInput): Result<Empresa, string[]> {
    const errors: string[] = [];

    let cnpjResult: Result<CNPJ | undefined, string>;
    if (input.estrangeira) cnpjResult = Result.ok(undefined);
    else cnpjResult = CNPJ.create(input.cnpj);
    if (cnpjResult.isFail()) errors.push(cnpjResult.unwrapFail());

    let atividadePrincipalResult = CNAE.create(input.atividadePrincipal + '');
    if (atividadePrincipalResult.isFail() && !input.estrangeira)
      errors.push(atividadePrincipalResult.unwrapFail());
    if (atividadePrincipalResult.isFail() && input.estrangeira)
      atividadePrincipalResult = Result.ok(undefined);

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
      historicoInvestimentos: this.extractHistoricoInvestimentos(input),
      historicoQuadroDeColaboradores:
        historicoQuadroDeColaboradoresResult.unwrap(),
      incubacoes: incubacoesResult.unwrap(),
      socios: this.extractSocios(input).unwrap(),
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
    return (
      (input.historicoInvestimentos || [])
        .map((f) =>
          RegistrosAnuaisFactory.investimento(
            f.anoFiscal,
            f.valor,
            f.origem as OrigemInvestimento,
          ),
        )
        .filter((f) => f.isOk())
        .map((f) => f.unwrap()) || []
    );
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

  private static extractSocios(
    input: EmpresaFactoryCreateInput,
  ): Result<Socio[], string[]> {
    const socios = [];
    for (const data of input.socios || []) {
      const vinculoResult = VinculoUniversidade.create(
        data.vinculo.tipo,
        data.vinculo.NUSP,
        data.vinculo.instituto,
      );
      if (vinculoResult.isFail()) continue;

      const sociosResult = Socio.create(
        data.nome,
        data.email,
        data.telefone,
        vinculoResult.unwrap(),
      );
      if (sociosResult.isOk()) socios.push(sociosResult.unwrap());
    }

    return Result.ok(socios);
  }
}
