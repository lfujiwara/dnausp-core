import { Investimento } from '@domain/valores-anuais';
import { AgregadoAnual } from '@domain/agregados-anuais/agregado-anual';

export class HistoricoInvestimentos extends AgregadoAnual<Investimento> {}
