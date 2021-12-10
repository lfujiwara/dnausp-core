import { AgregadoAnual } from '@domain/agregados-anuais/agregado-anual';
import { Faturamento } from '@domain/valores-anuais';

export class Faturante extends AgregadoAnual<Faturamento> {}
