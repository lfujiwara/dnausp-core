import { UpsertEmpresaMutationInput } from '@app';
import { EmpresaFactory, OrigemInvestimento } from '@domain';

const matchAnoValor = (a, b) =>
  a.anoFiscal === b.anoFiscal && a.valor === b.valor;
const matchAnoValorOrigem = (a, b) =>
  matchAnoValor(a, b) && a.origem === b.origem;

describe('Empresa factory', () => {
  const input: UpsertEmpresaMutationInput = {
    cnpj: '43.009.980/0001-04',
    anoFundacao: 2010,
    atividadePrincipal: '7020400',
    atividadeSecundaria: ['7210000'],
    faturamentos: [
      {
        anoFiscal: 2010,
        valor: 60 * 1000 * 100,
      },
      {
        anoFiscal: 2011,
        valor: 200 * 1000 * 100,
      },
    ],
    nomeFantasia: 'Empresa Teste',
    razaoSocial: 'Empresa Teste Ltda',
    historicoInvestimentos: [
      {
        anoFiscal: 2009,
        valor: 100 * 1000 * 100,
        origem: OrigemInvestimento.PIPEFAPESP,
      },
    ],
    historicoQuadroDeColaboradores: [
      {
        anoFiscal: 2010,
        valor: 20,
      },
    ],
  };

  test('create', () => {
    const empresaResult = EmpresaFactory.create(input);
    expect(empresaResult.isOk()).toBeTruthy();

    const empresa = empresaResult.unwrap();

    expect(empresa).toBeDefined();
    expect(empresa.nomeFantasia).toBe(input.nomeFantasia);
    expect(empresa.razaoSocial).toBe(input.razaoSocial);
    expect(empresa.cnpj.format()).toBe(input.cnpj);
    expect(empresa.anoFundacao).toBe(input.anoFundacao);
    expect(empresa.atividadePrincipal.unFormat()).toBe(
      input.atividadePrincipal,
    );

    expect(
      empresa.atividadeSecundaria.every((x) =>
        input.atividadeSecundaria.includes(x.unFormat()),
      ),
    ).toBeTruthy();

    expect(
      empresa.faturante.valores.every((x) =>
        input.faturamentos.some(matchAnoValor.bind(null, x)),
      ),
    ).toBeTruthy();

    expect(
      empresa.historicoInvestimentos.valores.every((x) =>
        input.historicoInvestimentos.some(matchAnoValorOrigem.bind(null, x)),
      ),
    ).toBeTruthy();

    expect(
      empresa.historicoQuadroDeColaboradores.valores.every((x) =>
        input.historicoQuadroDeColaboradores.some(matchAnoValor.bind(null, x)),
      ),
    ).toBeTruthy();
  });
});
