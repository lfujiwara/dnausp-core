import { UpsertEmpresaMutation, UpsertEmpresaMutationInput } from '@app';
import { Result } from 'typescript-monads';
import { CNPJ, EmpresaFactory, OrigemInvestimento } from '@domain';
import { EstadoIncubacao, IncubadoraUSP } from '@domain/incubacao';
import { TipoVinculo } from '@domain/enums/tipo-vinculo';
import { Instituto } from '@domain/enums/instituto';

describe('Upsert empresa mutation', () => {
  const input: UpsertEmpresaMutationInput = {
    cnpj: '43.009.980/0001-04',
    anoFundacao: 2011,
    atividadePrincipal: '7020400',
    atividadeSecundaria: ['7210000'],
    faturamentos: [
      {
        anoFiscal: 2011,
        valor: 90 * 1000 * 100,
      },
      {
        anoFiscal: 2012,
        valor: 240 * 1000 * 100,
      },
    ],
    nomeFantasia: 'Empresa Teste ABC',
    razaoSocial: 'Empresa Teste ABC Ltda',
    historicoInvestimentos: [
      {
        anoFiscal: 2010,
        valor: 100 * 1000 * 100,
        origem: OrigemInvestimento.BNDES_FINEP,
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
        incubadora: IncubadoraUSP.SUPERA,
      },
    ],
    socios: [
      {
        nome: 'John Doe',
        email: 'johndoe@gmail.com',
        telefone: '+5511999999999',
        vinculo: {
          tipo: TipoVinculo.GRADUACAO,
          NUSP: '123456789',
          instituto: Instituto.IME,
        },
      },
    ],
  };

  const sampleEmpresa = EmpresaFactory.create(input).unwrap();

  const port = {
    findOneByIdentifiers: jest.fn().mockResolvedValue(Result.ok(sampleEmpresa)),
    remove: jest.fn().mockResolvedValue(Result.ok(undefined)),
    save: jest.fn().mockImplementation((x) => Promise.resolve(Result.ok(x))),
  };
  const mutation = new UpsertEmpresaMutation(port as any);

  describe('Inputs', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('Handle invalid data', async () => {
      const result = await mutation.mutate({
        ...input,
        cnpj: '1029301930102193013',
      });
      expect(result.isFail()).toBeTruthy();
    });

    test('Handle port failure', async () => {
      port.save.mockResolvedValueOnce(Result.fail('Error'));

      const result = await mutation.mutate(input);
      expect(result.isFail()).toBeTruthy();
    });

    test('Data persistence w/o previous data', async () => {
      port.findOneByIdentifiers.mockResolvedValueOnce(Result.fail('Not found'));

      const result = await mutation.mutate(input);
      expect(result.isOk()).toBeTruthy();

      const empresa = result.unwrap();

      expect(CNPJ.format(empresa.cnpj.get())).toBe(input.cnpj);
      expect(empresa.anoFundacao).toBe(input.anoFundacao);
      expect(empresa.atividadePrincipal.get()).toBe(input.atividadePrincipal);

      expect(port.findOneByIdentifiers).toHaveBeenCalledTimes(1);
      expect(port.findOneByIdentifiers).toHaveBeenCalledWith(
        expect.objectContaining({
          cnpj: expect.stringMatching(sampleEmpresa.cnpj.unFormat()),
        }),
        input.idEstrangeira,
      );
      expect(port.save).toHaveBeenCalledTimes(1);
      expect(port.remove).not.toHaveBeenCalled();
    });

    test('OK Input w/ already existing', async () => {
      const result = await mutation.mutate(input);
      expect(result.isOk()).toBeTruthy();

      const empresa = result.unwrap();
      expect(empresa.id).toBe(sampleEmpresa.id);
      expect(port.remove).toHaveBeenCalledTimes(1);
    });
  });
});
