import { Result } from 'typescript-monads';
import { v4 } from 'uuid';
import { CNAE } from '@domain/cnae';
import { Faturante } from '@domain/agregados-anuais';
import { CNPJ } from '@domain/cnpj';

export class Empresa {
  id: string;
  idEstrangeira?: number;
  estrangeira = false;
  cnpj?: CNPJ;
  razaoSocial?: string;
  nomeFantasia?: string;
  anoFundacao: number;
  atividadePrincipal?: CNAE;
  atividadeSecundaria: CNAE[] = [];
  situacao?: string;
  faturante: Faturante = new Faturante();

  constructor(data: {
    id: string;
    idEstrangeira?: number;
    estrangeira?: boolean;
    cnpj?: CNPJ;
    razaoSocial?: string;
    nomeFantasia?: string;
    anoFundacao: number;
    atividadePrincipal?: CNAE;
    atividadeSecundaria?: CNAE[];
    situacao?: string;
    faturante: Faturante;
  }) {
    if (data.estrangeira && !data.idEstrangeira)
      throw new Error('Empresa estrangeira sem id estrangeira');
    if (!data.estrangeira && !data.cnpj)
      throw new Error('Empresa não estrangeira sem cnpj');
    if (!data.nomeFantasia && !data.razaoSocial)
      throw new Error('Empresa sem nome ou razão social');

    this.id = data.id;
    this.idEstrangeira = data.idEstrangeira;
    this.estrangeira = data.estrangeira;
    this.cnpj = data.cnpj;
    this.razaoSocial = data.razaoSocial;
    this.nomeFantasia = data.nomeFantasia;
    this.anoFundacao = data.anoFundacao;
    this.atividadePrincipal = data.atividadePrincipal;
    this.atividadeSecundaria = data.atividadeSecundaria || [];
    this.situacao = data.situacao;
    this.faturante = data.faturante;
  }

  static create(data: {
    idEstrangeira?: number;
    estrangeira: boolean;
    cnpj?: CNPJ;
    razaoSocial?: string;
    nomeFantasia?: string;
    anoFundacao: number;
    atividadePrincipal?: CNAE;
    atividadeSecundaria: CNAE[];
    situacao?: string;
    faturante: Faturante;
  }): Result<Empresa, string[]> {
    const errors: string[] = [];
    if (data.estrangeira && !data.idEstrangeira)
      errors.push('Empresa estrangeira sem id estrangeira');
    if (!data.estrangeira && !data.cnpj)
      errors.push('Empresa não estrangeira sem cnpj');
    if (!data.nomeFantasia && !data.razaoSocial)
      errors.push('Empresa sem nome ou razão social');

    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(
      new Empresa({
        id: v4(),
        ...data,
      }),
    );
  }

  static validateAnoDeFundacao(ano: string | number): Result<number, string> {
    const n = parseInt(ano + '', 10);

    if (isNaN(n) || n < 1900 || n > new Date().getFullYear())
      return Result.fail('Ano de fundação inválido');

    return Result.ok(n);
  }
}
