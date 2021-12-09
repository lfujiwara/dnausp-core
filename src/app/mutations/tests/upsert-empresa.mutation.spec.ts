import { UpsertEmpresaMutation, UpsertEmpresaMutationInput } from '@app';
import { Result } from 'typescript-monads';
import { CNPJ, Empresa } from '@domain';

describe('Upsert empresa mutation', () => {
  const port = {
    upsertEmpresa: jest
      .fn()
      .mockImplementation((x) => Promise.resolve(Result.ok(x))),
  };
  const mutation = new UpsertEmpresaMutation(port as any);

  const input: UpsertEmpresaMutationInput = {
    cnpj: '43.009.980/0001-04',
    anoFundacao: 2010,
    atividadePrincipal: '7020400',
    atividadeSecundaria: [],
    faturamentos: [],
    nomeFantasia: 'Empresa Teste',
    razaoSocial: 'Empresa Teste Ltda',
  };

  describe('Inputs', () => {
    beforeEach(() => {
      Object.values(port).forEach((mockFn) => mockFn.mockClear());
    });

    test('OK Input w/o revenues', async () => {
      port.upsertEmpresa.mockImplementationOnce((x) => Result.ok(x));

      const result = await mutation.mutate(input);
      expect(result.isOk()).toBeTruthy();

      const empresa = result.unwrap();
      expect(CNPJ.format(empresa.cnpj.get())).toBe(input.cnpj);
      expect(empresa.anoFundacao).toBe(input.anoFundacao);
      expect(empresa.atividadePrincipal.get()).toBe(input.atividadePrincipal);
    });

    test('OK Input w/ revenues', async () => {
      port.upsertEmpresa.mockImplementationOnce((x) => Result.ok(x));

      const empresa = (
        await mutation.mutate(
          Object.assign(input, {
            faturamentos: [
              { valor: 6000000, anoFiscal: 2018 },
              { valor: 12000000, anoFiscal: 2019 },
              { valor: 2900000, anoFiscal: 2020 },
            ],
          }),
        )
      ).unwrap();

      expect(empresa.faturamentos.length).toBe(3);
      empresa.faturamentos.forEach((f) => {
        const equivalent = input.faturamentos.find(
          (x) => x.anoFiscal === f.anoFiscal,
        );
        expect(f.valor).toBe(equivalent.valor);
      });
    });
  });

  describe('DB Port behavior', () => {
    beforeEach(() => {
      Object.values(port).forEach((mockFn) => mockFn.mockClear());
    });

    test('Calls the upsert method', async () => {
      port.upsertEmpresa.mockImplementationOnce((x) => Result.ok(x));

      await mutation.mutate(input);
      expect(port.upsertEmpresa).toHaveBeenCalledTimes(1);
      expect(port.upsertEmpresa).toHaveBeenCalledWith(expect.any(Empresa));
    });

    test('Handles a failed upsert gracefully', async () => {
      port.upsertEmpresa.mockImplementationOnce(() => Result.fail('DB Error'));

      const result = await mutation.mutate(input);
      expect(result.isFail()).toBeTruthy();
    });
  });
});
