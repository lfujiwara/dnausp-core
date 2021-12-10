import { Investimento } from '@domain/valores-anuais';
import { AgregadoAnual } from '@domain/agregados-anuais/agregado-anual';

export class PerfilInvestimento extends AgregadoAnual<Investimento> {}
