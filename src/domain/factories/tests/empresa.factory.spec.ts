import { UpsertEmpresaMutationInput } from '@app';
import { EmpresaFactory, OrigemInvestimento } from '@domain';
import { EstadoIncubacao, IncubadoraUSP } from '@domain/incubacao';
import { Instituto } from '@domain/enums/instituto';
import { TipoVinculo } from '@domain/enums/tipo-vinculo';

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
    incubacoes: [
      {
        estado: EstadoIncubacao.GRADUADA,
        incubadora: IncubadoraUSP.ESALQTEC,
      },
    ],
    socios: [
      {
        nome: 'John Doe',
        email: 'johndoe@gmail.com',
        telefone: '+5511999999999',
        vinculo: {
          tipo: TipoVinculo.DOCENTE,
          NUSP: '123456789',
          instituto: Instituto.FAU,
        },
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
      input.atividadeSecundaria.every((x) =>
        empresa.atividadeSecundaria.some((y) => y.unFormat() === x),
      ),
    ).toBeTruthy();

    expect(
      input.faturamentos.every((x) =>
        empresa.historicoFaturamentos.valores.some(matchAnoValor.bind(null, x)),
      ),
    ).toBeTruthy();

    expect(
      input.historicoInvestimentos.every((x) =>
        empresa.historicoInvestimentos.some(matchAnoValorOrigem.bind(null, x)),
      ),
    ).toBeTruthy();

    expect(
      input.historicoQuadroDeColaboradores.every((x) =>
        empresa.historicoQuadroDeColaboradores.valores.some(
          matchAnoValor.bind(null, x),
        ),
      ),
    ).toBeTruthy();

    expect(
      input.incubacoes.every((x) =>
        empresa.incubacoes.some(
          (y) => x.incubadora === y.incubadora && x.estado === y.estado,
        ),
      ),
    ).toBeTruthy();

    expect(
      input.socios.every((x) =>
        empresa.socios.some(
          (y) =>
            x.nome === y.nome &&
            x.email === y.email &&
            x.telefone === y.telefone &&
            x.vinculo.tipo === y.vinculo.tipo &&
            x.vinculo.NUSP === y.vinculo.NUSP &&
            x.vinculo.instituto === y.vinculo.instituto,
        ),
      ),
    ).toBeTruthy();
  });
});
