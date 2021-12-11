import { VinculoUniversidade } from '@domain/vinculo-universidade';
import { Result } from 'typescript-monads';

export class Socio {
  readonly nome: string;
  readonly email?: string;
  readonly telefone?: string;
  readonly vinculo?: VinculoUniversidade;

  constructor(
    nome: string,
    email?: string,
    telefone?: string,
    vinculo?: VinculoUniversidade,
  ) {
    this.nome = nome;
    this.email = email;
    this.telefone = telefone;
    this.vinculo = vinculo;
  }

  static create(
    nome: string,
    email?: string,
    telefone?: string,
    vinculo?: VinculoUniversidade,
  ): Result<Socio, string[]> {
    if (!nome) {
      return Result.fail<Socio, string[]>(['O nome do sócio é obrigatório.']);
    }

    return Result.ok(new Socio(nome, email, telefone, vinculo));
  }
}
