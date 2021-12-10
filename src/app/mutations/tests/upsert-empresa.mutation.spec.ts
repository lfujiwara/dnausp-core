import { UpsertEmpresaMutation, UpsertEmpresaMutationInput } from '@app';
import { Result } from 'typescript-monads';
import { CNPJ, EmpresaFactory } from '@domain';

describe('Upsert empresa mutation', () => {
  const input: UpsertEmpresaMutationInput = {
    cnpj: '43.009.980/0001-04',
    anoFundacao: 2010,
    atividadePrincipal: '7020400',
    atividadeSecundaria: [],
    faturamentos: [],
    nomeFantasia: 'Empresa Teste',
    razaoSocial: 'Empresa Teste Ltda',
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
