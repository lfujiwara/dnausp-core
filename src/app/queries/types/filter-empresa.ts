import { Instituto, TipoVinculo } from '@domain';

export interface FilterEmpresa {
  instituto?: Instituto[];
  tipoVinculo?: TipoVinculo[];
  origemInvestimento?: string[];
  atividadePrincipal?: string[];
  anoFundacaoMin?: number;
  anoFundacaoMax?: number;
}
